"""Generate the declared Bible passages with pinned Kokoro assets, or verify them.

Run in the Kokoro environment documented in docs/narracao-multimodal.md.
The script resumes verified MP3 files and never rewrites the Bible corpus.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import tempfile
import time

ROOT = Path(__file__).resolve().parents[1]
CORPUS = ROOT / "src/content/bible/blivre-tr-2018.json"
CATALOG = ROOT / "src/content/narration/passages.json"
OUTPUT = ROOT / "public/audio/scripture"
MANIFEST = ROOT / "src/content/narration/recordings.json"
PUBLIC_MANIFEST = OUTPUT / "proveniencia.json"
EXPECTED = {
    "model_quantized.onnx": "fbae9257e1e05ffc727e951ef9b9c98418e6d79f1c9b6b13bd59f5c9028a1478",
    "pm_alex.bin": "0175c753f59c54e7fd5a995bedef0c5ff2fb67e0043dd3dcb2ae74ec2acbeb2a",
    "config.json": "5abb01e2403b072bf03d04fde160443e209d7a0dad49a423be15196b9b43c17f",
}


def digest(data):
    return hashlib.sha256(data).hexdigest()


def read_json(path):
    return json.loads(path.read_text())


def inspect_audio(path):
    probe = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(path)], check=True, capture_output=True, text=True)
    return float(json.loads(probe.stdout)["format"]["duration"])


def valid_record(record, original, path):
    if not record or not path.exists() or record.get("text") != original:
        return False
    data = path.read_bytes()
    return record.get("bytes") == len(data) and record.get("sha256") == digest(data) and abs(record.get("durationSeconds", 0) - inspect_audio(path)) < .06


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    corpus = read_json(CORPUS)
    passages = read_json(CATALOG)
    edition = read_json(ROOT / "src/content/bible/edition.json")
    previous = read_json(MANIFEST) if MANIFEST.exists() else {"passages": []}
    old_records = {item["src"]: item for passage in previous["passages"] for item in passage["verses"]}
    OUTPUT.mkdir(parents=True, exist_ok=True)
    generator = None
    np = sf = None
    if not args.check:
        import numpy as np
        import soundfile as sf
        import onnxruntime as ort
        from kokoro_onnx import Kokoro
        model_root = Path(os.environ.get("INJESSUS_TTS_MODELS", "/tmp/injessus-kokoro-model"))
        for filename, expected in EXPECTED.items():
            if digest((model_root / filename).read_bytes()) != expected:
                raise RuntimeError("Asset differs from pinned source: " + filename)
        ort.disable_telemetry_events()
        voice = np.fromfile(model_root / "pm_alex.bin", dtype=np.float32).reshape(-1, 1, 256)
        voice_path = model_root / "scripture-voices.npz"
        np.savez(voice_path, pm_alex=voice)
        options = ort.SessionOptions()
        options.intra_op_num_threads = 2
        options.inter_op_num_threads = 1
        session = ort.InferenceSession(str(model_root / "model_quantized.onnx"), sess_options=options, providers=["CPUExecutionProvider"])
        generator = Kokoro.from_session(session, str(voice_path), vocab_config=str(model_root / "config.json"))
    manifest = {
        "createdAt": previous.get("createdAt", time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())),
        "model": {"id": "hexgrad/Kokoro-82M", "revision": "f3ff3571791e39611d31c381e3a41a3af07b4987", "url": "https://huggingface.co/hexgrad/Kokoro-82M", "license": "Apache-2.0"},
        "conversion": {"id": "onnx-community/Kokoro-82M-v1.0-ONNX", "revision": "1939ad2a8e416c0acfeecc08a694d14ef25f2231", "license": "Apache-2.0"},
        "voice": "pm_alex",
        "language": "pt-br",
        "speed": .91,
        "sampleRate": 24000,
        "runtime": "kokoro-onnx 0.6.1, onnxruntime 1.31.1 CPUExecutionProvider; 2 inference threads",
        "sourceCorpusSha256": digest(CORPUS.read_bytes()),
        "edition": {"id": edition["id"], "name": edition["name"], "attribution": edition["attribution"], "license": edition["license"], "licenseUrl": edition["licenseUrl"]},
        "processing": "Voz sintética. Cada arquivo pronuncia o texto do versículo desta edição. A segmentação por versículo fornece alinhamento para o destaque; não é alinhamento palavra por palavra.",
        "humanReview": "Reprodução e integridade verificadas tecnicamente. Pronúncia, naturalidade e adequação pastoral aguardam revisão humana; nenhum selo de revisão foi atribuído.",
        "privacy": "Arquivos estáticos pré-gerados. Nenhuma voz, oração ou anotação do visitante é enviada para um modelo.",
        "reproduce": "python scripts/generate-scripture-narration.py; --check para verificar os arquivos existentes.",
        "passages": []
    }
    total = 0
    for passage in passages:
        book = next(book for book in corpus["books"] if book["id"] == passage["bookId"])
        chapter = book["chapters"][passage["chapter"] - 1]
        entry = {**passage, "bookName": book["name"], "reference": f'{book["name"]} {passage["chapter"]}:{passage["startVerse"]}–{passage["endVerse"]}', "verses": []}
        for number in range(passage["startVerse"], passage["endVerse"] + 1):
            original = chapter[number - 1]
            src = f'/audio/scripture/{passage["bookId"].lower()}-{passage["chapter"]}-{number}.mp3'
            path = ROOT / "public" / src.lstrip("/")
            record = old_records.get(src)
            if not valid_record(record, original, path):
                if args.check:
                    raise RuntimeError("Recording missing or divergent: " + src)
                started = time.monotonic()
                samples, rate = generator.create(original, voice="pm_alex", lang="pt-br", speed=.91)
                if not np.isfinite(samples).all() or len(samples) == 0:
                    raise RuntimeError("Invalid generated waveform: " + src)
                peak = float(np.max(np.abs(samples)))
                if peak > .94:
                    samples = samples * (.94 / peak)
                with tempfile.TemporaryDirectory(prefix="injessus-scripture-") as scratch:
                    wav = Path(scratch) / "verse.wav"
                    sf.write(wav, samples, rate, subtype="PCM_16")
                    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(wav), "-codec:a", "libmp3lame", "-b:a", "96k", str(path)], check=True)
                data = path.read_bytes()
                record = {"number": number, "text": original, "src": src, "durationSeconds": inspect_audio(path), "bytes": len(data), "sha256": digest(data)}
                print(f'{src}: {record["durationSeconds"]:.2f}s audio; {time.monotonic()-started:.2f}s generation', flush=True)
            entry["verses"].append(record)
            total += 1
        manifest["passages"].append(entry)
        if not args.check:
            # A complete passage is committed to the resumable manifest atomically.
            encoded = json.dumps(manifest, ensure_ascii=False, indent=2) + "\n"
            MANIFEST.write_text(encoded)
            PUBLIC_MANIFEST.write_text(encoded)
    if args.check:
        if manifest["sourceCorpusSha256"] != previous.get("sourceCorpusSha256"):
            raise RuntimeError("The recorded edition differs from the source corpus")
        if previous != read_json(PUBLIC_MANIFEST):
            raise RuntimeError("Public and source manifests differ")
        expected_paths = {record["src"] for passage in previous["passages"] for record in passage["verses"]}
        actual_paths = {"/audio/scripture/" + path.name for path in OUTPUT.glob("*.mp3")}
        if actual_paths != expected_paths:
            raise RuntimeError("There are undocumented or missing MP3 files")
    print(f'{total} verse recordings in {len(passages)} passages {"verified" if args.check else "generated"}.', flush=True)


if __name__ == "__main__":
    main()
