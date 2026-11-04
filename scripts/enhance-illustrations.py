"""Reproduce the bounded Swin2SR artistic-detail experiment (CPU only).

The raw RGB inputs/outputs are prepared/encoded by the companion Node script.
No historical photograph or museum inscription is used. Model weights stay in a
local cache, outside the web application's public files.
"""
import argparse
import hashlib
import json
from pathlib import Path
import time

import numpy as np
import onnxruntime as ort

EXPECTED_MODEL_SHA256 = "6dde3fe2440543ccae7c40d175609f83c18aeaa3d8456745c4329ef97ae744bd"
parser = argparse.ArgumentParser()
parser.add_argument("--model", required=True)
parser.add_argument("--input", required=True)
parser.add_argument("--output", required=True)
parser.add_argument("--width", type=int, required=True)
parser.add_argument("--height", type=int, required=True)
args = parser.parse_args()
if args.width < 8 or args.height < 8 or args.width > 256 or args.height > 256:
    raise RuntimeError("Este experimento aceita apenas recortes artísticos de até 256 pixels por lado.")
model_path = Path(args.model)
if hashlib.sha256(model_path.read_bytes()).hexdigest() != EXPECTED_MODEL_SHA256:
    raise RuntimeError("O modelo não corresponde à conversão ONNX fixada.")
raw = np.fromfile(args.input, dtype=np.uint8)
if raw.size != args.width * args.height * 3:
    raise RuntimeError("RGB de entrada não corresponde às dimensões declaradas.")
pixels = raw.reshape(args.height, args.width, 3).astype(np.float32) / 255.0
# Swin2SR expects channel-first RGB in [0,1], with reflect-padding to window 8.
pad_h = (8 - args.height % 8) % 8
pad_w = (8 - args.width % 8) % 8
pixels = np.pad(pixels, ((0, pad_h), (0, pad_w), (0, 0)), mode="reflect")
pixels = np.transpose(pixels, (2, 0, 1))[None, ...]
ort.disable_telemetry_events()
options = ort.SessionOptions()
options.intra_op_num_threads = 1
options.inter_op_num_threads = 1
# Basic folding avoids the very long extended-optimization startup for this
# exported transformer graph. Inference still executes its actual learned weights.
options.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_BASIC
start = time.monotonic()
session = ort.InferenceSession(str(model_path), sess_options=options, providers=["CPUExecutionProvider"])
loaded_at = time.monotonic()
output = session.run(None, {session.get_inputs()[0].name: pixels})[0]
if output.ndim != 4 or output.shape[1] != 3 or not np.isfinite(output).all():
    raise RuntimeError("Saída do modelo contém formato ou valores inválidos.")
output = output[0, :, :args.height * 2, :args.width * 2]
output = np.rint(np.clip(np.transpose(output, (1, 2, 0)), 0, 1) * 255).astype(np.uint8)
output.tofile(args.output)
print(json.dumps({"width": output.shape[1], "height": output.shape[0], "channels": 3,
                  "runtime": "onnxruntime", "runtimeVersion": ort.__version__, "provider": "CPUExecutionProvider",
                  "threads": 1, "modelLoadSeconds": round(loaded_at - start, 3),
                  "inferenceSeconds": round(time.monotonic() - loaded_at, 3), "inputName": session.get_inputs()[0].name,
                  "outputName": session.get_outputs()[0].name, "modelSha256": EXPECTED_MODEL_SHA256}, ensure_ascii=False))
