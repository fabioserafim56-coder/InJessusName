"use client";

import { useCallback, useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { Check, Microphone, MicrophoneSlash, UploadSimple, X } from "@phosphor-icons/react/ssr";
import { voiceModel, type VoiceWorkerRequest, type VoiceWorkerResponse } from "@/lib/voice/model";
import { decodeVoiceAudio, validateAudioFile } from "./voice-audio";
import "./voice-input.css";

type Phase = "idle" | "loading" | "ready" | "opening" | "recording" | "decoding" | "transcribing" | "review" | "error";

export function VoiceInput({ onTranscript, label = "Conte sua pergunta com sua voz" }: { onTranscript: (text: string) => void; label?: string }) {
  const id = useId();
  const [phase, setPhase] = useState<Phase>("idle");
  const [modelReady, setModelReady] = useState(false);
  const [download, setDownload] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [draft, setDraft] = useState("");
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [seconds, setSeconds] = useState(0);
  const worker = useRef<Worker | null>(null);
  const request = useRef(0);
  const audio = useRef<Blob | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const recordingChunks = useRef<Blob[]>([]);
  const previewUrl = useRef("");
  const previewPlayer = useRef<HTMLAudioElement | null>(null);
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clock = useRef<ReturnType<typeof setInterval> | null>(null);
  const mounted = useRef(true);
  const abandonedRecording = useRef(false);
  const busy = ["loading", "opening", "decoding", "transcribing"].includes(phase);

  const releaseMicrophone = useCallback(() => {
    if (stopTimer.current) clearTimeout(stopTimer.current);
    if (clock.current) clearInterval(clock.current);
    stopTimer.current = null;
    clock.current = null;
    stream.current?.getTracks().forEach(track => track.stop());
    stream.current = null;
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      abandonedRecording.current = true;
      if (recorder.current?.state === "recording") recorder.current.stop();
      releaseMicrophone();
      worker.current?.terminate();
      worker.current = null;
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
      audio.current = null;
    };
  }, [releaseMicrophone]);

  useEffect(() => {
    const player = previewPlayer.current;
    return () => player?.pause();
  }, [preview]);

  function fail(error: unknown) {
    setPhase("error");
    setMessage(error instanceof Error ? error.message : "Não foi possível ouvir agora. Você pode continuar escrevendo.");
  }

  function ensureWorker() {
    if (worker.current) return worker.current;
    if (typeof Worker === "undefined" || typeof WebAssembly === "undefined") throw new Error("Este navegador não oferece o reconhecimento local de voz. Você pode continuar escrevendo sua pergunta.");
    const target = new Worker(new URL("./voice-worker.ts", import.meta.url), { type: "module" });
    target.onmessage = ({ data }: MessageEvent<VoiceWorkerResponse>) => {
      if (!mounted.current || data.id !== request.current) return;
      if (data.type === "progress") setDownload(data.progress);
      if (data.type === "ready") { setModelReady(true); setDownload(100); setPhase(current => current === "loading" ? "ready" : current); }
      if (data.type === "transcribing") setPhase("transcribing");
      if (data.type === "transcript") {
        setDraft(data.text);
        setPhase("review");
        setMessage(data.text ? "Vamos conferir o que foi ouvido. Ajuste qualquer palavra antes de continuar." : "Não reconhecemos palavras nessa gravação. Podemos tentar de novo ou escrever aqui.");
      }
      if (data.type === "error") { setModelReady(false); setPhase("error"); setMessage(data.message); }
    };
    target.onerror = () => { target.terminate(); if (worker.current === target) worker.current = null; if (mounted.current) { setModelReady(false); fail(new Error("O reconhecimento de voz não abriu neste navegador. Tente novamente ou continue escrevendo.")); } };
    worker.current = target;
    return target;
  }

  function prepare() {
    try {
      setMessage("");
      setPhase("loading");
      setDownload(null);
      const data: VoiceWorkerRequest = { type: "prepare", id: ++request.current };
      ensureWorker().postMessage(data);
    } catch (error) { fail(error); }
  }

  function selectAudio(blob: Blob, name: string) {
    validateAudioFile(blob, name);
    previewPlayer.current?.pause();
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    previewUrl.current = URL.createObjectURL(blob);
    audio.current = blob;
    setPreview(previewUrl.current);
    setFileName(name);
    setDraft("");
    setMessage("");
    setPhase(modelReady ? "ready" : "idle");
  }

  function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try { selectAudio(file, file.name); } catch (error) { fail(error); }
  }

  async function record() {
    if (busy || phase === "recording") return;
    const current = ++request.current;
    try {
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") throw new Error("O microfone precisa de um navegador compatível e conexão segura. Você também pode escolher um arquivo de áudio ou escrever sua pergunta.");
      setPhase("opening");
      const capture = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } });
      if (!mounted.current || current !== request.current) { capture.getTracks().forEach(track => track.stop()); return; }
      stream.current = capture;
      abandonedRecording.current = false;
      recordingChunks.current = [];
      const mimeType = ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus"].find(type => MediaRecorder.isTypeSupported(type));
      const captureRecorder = new MediaRecorder(capture, mimeType ? { mimeType } : undefined);
      recorder.current = captureRecorder;
      captureRecorder.ondataavailable = event => { if (event.data.size) recordingChunks.current.push(event.data); };
      captureRecorder.onerror = () => { abandonedRecording.current = true; releaseMicrophone(); if (mounted.current) fail(new Error("A gravação foi interrompida. Podemos tentar outra vez ou escolher um arquivo.")); };
      captureRecorder.onstop = () => {
        const blob = new Blob(recordingChunks.current, { type: captureRecorder.mimeType || "audio/webm" });
        recordingChunks.current = [];
        releaseMicrophone();
        if (mounted.current && !abandonedRecording.current) {
          try { selectAudio(blob, "Sua gravação"); } catch (error) { fail(error); }
        }
      };
      captureRecorder.start(1000);
      setSeconds(0);
      setPhase("recording");
      setMessage("");
      clock.current = setInterval(() => setSeconds(value => Math.min(59, value + 1)), 1000);
      stopTimer.current = setTimeout(() => { if (captureRecorder.state === "recording") captureRecorder.stop(); }, 59_000);
    } catch (error) {
      releaseMicrophone();
      if (mounted.current && current === request.current) fail(new Error(error instanceof DOMException && error.name === "NotAllowedError" ? "O microfone não foi autorizado. Você pode escolher um áudio ou continuar escrevendo, sem perder seu estudo." : error instanceof Error ? error.message : "Não foi possível abrir o microfone."));
    }
  }

  async function transcribe() {
    if (!audio.current || busy || phase === "recording") return;
    const current = ++request.current;
    try {
      setPhase("decoding");
      setMessage("");
      const samples = await decodeVoiceAudio(audio.current, fileName);
      if (!mounted.current || current !== request.current) return;
      setPhase(modelReady ? "transcribing" : "loading");
      const data: VoiceWorkerRequest = { type: "transcribe", id: current, samples };
      ensureWorker().postMessage(data, [samples.buffer]);
    } catch (error) { if (mounted.current && current === request.current) fail(error); }
  }

  function close() {
    abandonedRecording.current = true;
    request.current++;
    if (recorder.current?.state === "recording") recorder.current.stop();
    releaseMicrophone();
    worker.current?.terminate();
    worker.current = null;
    previewPlayer.current?.pause();
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    previewUrl.current = "";
    audio.current = null;
    recordingChunks.current = [];
    setPreview(""); setFileName(""); setDraft(""); setMessage(""); setDownload(null); setModelReady(false); setPhase("idle");
  }

  return <section className="voice-input" data-voice-input data-voice-phase={phase} aria-labelledby={`${id}-title`}>
    <header><span className="vi-symbol" aria-hidden="true"><Microphone size={25} /></span><div><p className="vi-eyebrow">HÁ ESPAÇO PARA SUA VOZ</p><h3 id={`${id}-title`}>{label}</h3></div>{(phase !== "idle" || Boolean(preview)) && <button className="vi-close" type="button" aria-label="Fechar voz e liberar recursos" onClick={close}><X size={19} aria-hidden="true" /></button>}</header>
    <p className="vi-introduction">Fale com calma, como numa conversa. Depois vamos conferir juntos o que foi escrito antes de usar suas palavras no estudo.</p>
    <div className="vi-actions">
      {phase === "recording" ? <button type="button" className="vi-primary vi-recording" onClick={() => recorder.current?.stop()}><MicrophoneSlash size={19} aria-hidden="true" />Encerrar gravação · {seconds}s</button> : <button type="button" className="vi-primary" disabled={busy} onClick={record}><Microphone size={19} aria-hidden="true" />Gravar minha voz</button>}
      <label className={`vi-upload${busy || phase === "recording" ? " vi-disabled" : ""}`}><UploadSimple size={19} aria-hidden="true" /><span>Escolher um áudio</span><input type="file" accept="audio/*,.wav,.mp3,.m4a,.webm,.ogg,.flac" aria-label="Escolher áudio para transcrever" onChange={upload} disabled={busy || phase === "recording"} /></label>
      {!modelReady && !busy && phase !== "recording" && <button className="vi-prepare" type="button" onClick={prepare}>Preparar reconhecimento de voz</button>}
    </div>
    <p className="vi-limit">Até {voiceModel.maximumSeconds} segundos e 8 MB. No primeiro uso, o reconhecimento baixa um modelo de dezenas de megabytes para este navegador. O áudio fica somente nesta visita e não é enviado ao servidor.</p>
    {preview && <div className="vi-preview"><p>{fileName}</p><audio ref={previewPlayer} key={preview} controls preload="metadata" src={preview} aria-label="Ouvir áudio escolhido para transcrição" /><button type="button" className="vi-primary" disabled={busy || phase === "recording"} onClick={transcribe}>{busy ? "Aguarde um instante" : "Transcrever este áudio"}</button></div>}
    <div className="vi-status" role="status" aria-live="polite">{phase === "loading" && <><p>Preparando o reconhecimento neste navegador{download !== null ? ` · ${download}%` : "…"}</p><progress max={100} value={download ?? undefined} aria-label="Preparação do reconhecimento de voz" /></>}{phase === "opening" && <p>Autorize o microfone no aviso do navegador para começar.</p>}{phase === "ready" && !preview && <p>O reconhecimento está pronto. Você pode gravar ou escolher um áudio.</p>}{phase === "decoding" && <p>Preparando seu áudio para ouvir…</p>}{phase === "transcribing" && <p>Transcrevendo em português, neste navegador. Isso pode levar um pouco, conforme o aparelho.</p>}{phase === "recording" && <p>Estamos gravando. Use “Encerrar gravação” quando terminar.</p>}{message && <p className={phase === "error" ? "vi-error" : ""}>{message}</p>}</div>
    {phase === "review" && <div className="vi-review"><label htmlFor={`${id}-transcript`}>O que foi ouvido — confira e ajuste</label><textarea id={`${id}-transcript`} rows={4} maxLength={6000} value={draft} onChange={event => setDraft(event.target.value)} placeholder="Você também pode escrever ou corrigir aqui." /><button className="vi-primary" type="button" disabled={!draft.trim()} onClick={() => { onTranscript(draft.trim()); setMessage("Suas palavras foram levadas ao estudo. Você pode reler e ajustar quando desejar."); }}><Check size={19} aria-hidden="true" />Usar este texto</button></div>}
    <details className="vi-origin"><summary>Como a voz é reconhecida</summary><p>Usamos Whisper Tiny multilíngue, com processamento local em português. A transcrição pode trocar palavras, especialmente nomes bíblicos; por isso você sempre pode conferir e corrigir antes de continuar. O modelo reconhece palavras e não avalia sua fé.</p><a href={`${voiceModel.source}/tree/${voiceModel.revision}`} target="_blank" rel="noreferrer">Modelo e revisão utilizados</a><span> · </span><a href={voiceModel.original} target="_blank" rel="noreferrer">Whisper · licença MIT</a></details>
  </section>;
}
