/** Pinned multilingual Whisper conversion; the English-only .en model is not used. */
export const voiceModel = {
  id: "onnx-community/whisper-tiny",
  revision: "ff4177021cc41f7db950912b73ea4fdf7d01d8e7",
  original: "https://github.com/openai/whisper",
  source: "https://huggingface.co/onnx-community/whisper-tiny",
  license: "MIT",
  language: "portuguese",
  samplingRate: 16000,
  maximumSeconds: 60,
  maximumBytes: 8 * 1024 * 1024,
  files: {
    "encoder_model_quantized.onnx": { bytes: 10124990, sha256: "2af4a414ca47aa30f61246017e5fe82b0a8d229281d1255ba666a2a7f6b84d19" },
    "decoder_model_merged_quantized.onnx": { bytes: 30719241, sha256: "25e807a962b6349356d0ea5d0dfe530b7e5bf0e2a484aeca0359d03143faddd3" },
    "decoder_model_quantized.onnx": { bytes: 30461071, sha256: "2a160a2a5ccf901f83aa4d4ceec580a269bd2cec582871e0816e98c610594f12" },
    "decoder_with_past_model_quantized.onnx": { bytes: 29220476, sha256: "9fe615bbbf4e871eac150e6ab3732b22515ae347d6f73fb009775c6ee04c5858" }
  }
} as const;

export type VoiceWorkerRequest = { type: "prepare"; id: number } | { type: "transcribe"; id: number; samples: Float32Array };
export type VoiceWorkerResponse =
  | { type: "progress"; id: number; progress: number | null }
  | { type: "ready"; id: number }
  | { type: "transcribing"; id: number }
  | { type: "transcript"; id: number; text: string }
  | { type: "error"; id: number; message: string };
