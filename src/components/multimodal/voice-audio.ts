import { voiceModel } from "@/lib/voice/model";

const audioExtensions = /\.(wav|mp3|m4a|mp4|webm|ogg|oga|flac|aac|opus)$/i;

/** Convert a short, decoded recording to the mono 16 kHz PCM expected by Whisper. */
export function resampleMono(channels: readonly Float32Array[], sampleRate: number): Float32Array {
  if (!channels.length || !Number.isFinite(sampleRate) || sampleRate < 8000 || sampleRate > 384000) throw new Error("Não conseguimos reconhecer o formato desse áudio.");
  const length = channels[0].length;
  if (!length || channels.some(channel => channel.length !== length)) throw new Error("Esse áudio está vazio ou incompleto.");
  const duration = length / sampleRate;
  if (duration > voiceModel.maximumSeconds + .1) throw new Error("Escolha um áudio de até 60 segundos. Podemos trabalhar uma pergunta de cada vez.");
  const output = new Float32Array(Math.max(1, Math.round(duration * voiceModel.samplingRate)));
  let energy = 0;
  for (let index = 0; index < output.length; index++) {
    const position = index * sampleRate / voiceModel.samplingRate;
    const first = Math.min(length - 1, Math.floor(position));
    const next = Math.min(length - 1, first + 1);
    const fraction = position - first;
    let sample = 0;
    for (const channel of channels) sample += channel[first] * (1 - fraction) + channel[next] * fraction;
    sample /= channels.length;
    if (!Number.isFinite(sample)) throw new Error("Não conseguimos ler esse áudio. Experimente gravar novamente.");
    output[index] = Math.max(-1, Math.min(1, sample));
    energy += output[index] * output[index];
  }
  if (Math.sqrt(energy / output.length) < .00002) throw new Error("O áudio está muito baixo ou em silêncio. Experimente falar um pouco mais perto do microfone.");
  return output;
}

export function validateAudioFile(blob: Blob, name?: string): void {
  if (!blob.size) throw new Error("Esse áudio está vazio. Podemos tentar outra gravação.");
  if (blob.size > voiceModel.maximumBytes) throw new Error("Escolha um arquivo de áudio de até 8 MB e 60 segundos.");
  const mime = blob.type.split(";")[0].toLowerCase();
  if (mime && !mime.startsWith("audio/") && mime !== "application/ogg" && mime !== "application/octet-stream") throw new Error("Escolha um arquivo de áudio, como MP3, WAV, M4A ou WebM.");
  if (!mime && name && !audioExtensions.test(name)) throw new Error("Escolha um arquivo de áudio, como MP3, WAV, M4A ou WebM.");
}

export async function decodeVoiceAudio(blob: Blob, name?: string): Promise<Float32Array> {
  validateAudioFile(blob, name);
  if (typeof AudioContext === "undefined") throw new Error("Este navegador não consegue preparar o áudio. Você pode continuar escrevendo sua pergunta.");
  const context = new AudioContext();
  try {
    const decoded = await context.decodeAudioData(await blob.arrayBuffer());
    if (decoded.duration > voiceModel.maximumSeconds + .1) throw new Error("Escolha um áudio de até 60 segundos. Podemos trabalhar uma pergunta de cada vez.");
    return resampleMono(Array.from({ length: decoded.numberOfChannels }, (_, index) => decoded.getChannelData(index)), decoded.sampleRate);
  } catch (error) {
    if (error instanceof Error && /60 segundos|muito baixo|formato|incompleto|silêncio/.test(error.message)) throw error;
    throw new Error("Não foi possível abrir esse áudio. Experimente um arquivo MP3 ou WAV, ou grave novamente.");
  } finally { await context.close(); }
}
