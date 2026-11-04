"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore, type ChangeEvent } from "react";
import { ArrowRight, Camera, FileImage, MagnifyingGlass, Scan, X } from "@phosphor-icons/react/ssr";
import type { Worker as OcrWorker } from "tesseract.js";
import type { LocateResponse } from "@/lib/ocr/types";
import "./passage-camera.css";

const MAX_BYTES = 8 * 1024 * 1024;
const permittedTypes = ["image/jpeg", "image/png", "image/webp"];
const subscribeToReadiness = () => () => {};
const clientReady = () => true;
const serverReady = () => false;
const statusNames: Record<string, string> = {
  "loading tesseract core": "Preparando o leitor de imagens…",
  "initializing tesseract": "Preparando o reconhecimento…",
  "loading language traineddata": "Carregando a leitura em português…",
  "initializing api": "Preparando a leitura em português…",
  "recognizing text": "Acompanhando as palavras da sua página…"
};

export function PassageCamera() {
  const id = useId();
  const ready = useSyncExternalStore(subscribeToReadiness, clientReady, serverReady);
  const fileInput = useRef<HTMLInputElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const worker = useRef<OcrWorker | null>(null);
  const operation = useRef(0);
  const previewUrl = useRef<string | null>(null);
  const request = useRef<AbortController | null>(null);
  const alive = useRef(true);
  const cameraRequest = useRef(false);
  const [picture, setPicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraBusy, setCameraBusy] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [finding, setFinding] = useState(false);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [matches, setMatches] = useState<LocateResponse | null>(null);
  const [paddleAvailable, setPaddleAvailable] = useState(false);
  const [provider, setProvider] = useState<"device" | "paddle">("device");

  useEffect(() => {
    const lifecycleOperation = operation;
    const lifecycleAlive = alive;
    lifecycleAlive.current = true;
    const availability = new AbortController();
    fetch("/api/multimodal/ocr", { signal: availability.signal, cache: "no-store" })
      .then(response => response.ok ? response.json() : null)
      .then((data: { available?: boolean } | null) => { if (data?.available) setPaddleAvailable(true); })
      .catch(() => {});
    return () => {
      availability.abort();
      lifecycleOperation.current++;
      lifecycleAlive.current = false;
      request.current?.abort();
      stream.current?.getTracks().forEach(track => track.stop());
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
      void worker.current?.terminate();
      worker.current = null;
    };
  }, []);

  useEffect(() => {
    if (cameraOpen && video.current && stream.current) {
      video.current.srcObject = stream.current;
      void video.current.play().catch(() => setError("Toque na prévia para acompanhar a câmera, ou escolha uma fotografia."));
    }
  }, [cameraOpen]);

  function closeCamera() {
    operation.current++;
    stream.current?.getTracks().forEach(track => track.stop());
    stream.current = null;
    setCameraOpen(false);
    setCameraBusy(false);
  }

  async function choosePicture(file: File | undefined) {
    if (!file || !alive.current) return;
    const attempt = ++operation.current;
    setError("");
    if (!permittedTypes.includes(file.type)) { setError("Escolha uma fotografia JPEG, PNG ou WebP."); return; }
    if (file.size > MAX_BYTES) { setError("Escolha uma imagem de até 8 MB, ou fotografe a página pela câmera do aplicativo."); return; }
    try {
      const bitmap = await createImageBitmap(file);
      const tooLarge = bitmap.width * bitmap.height > 32_000_000;
      bitmap.close();
      if (!alive.current || operation.current !== attempt) return;
      if (tooLarge) { setError("Esta imagem é grande demais para ler neste aparelho. Aproxime a câmera somente do trecho desejado."); return; }
    } catch { if (operation.current === attempt) setError("Não conseguimos abrir esta imagem. Escolha outra fotografia ou escreva a referência abaixo."); return; }
    closeCamera();
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    previewUrl.current = URL.createObjectURL(file);
    setPicture(file);
    setPreview(previewUrl.current);
    setText("");
    setMatches(null);
    setStatus("Sua página está pronta. Escolha reconhecer o texto quando desejar.");
  }

  async function openCamera() {
    if (!alive.current || cameraRequest.current || cameraOpen || busy || finding) return;
    const attempt = ++operation.current;
    setError("");
    if (!navigator.mediaDevices?.getUserMedia) { setError("Este navegador não oferece a câmera aqui. Você pode escolher uma foto do aparelho."); return; }
    cameraRequest.current = true;
    setCameraBusy(true);
    try {
      const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1440 } }, audio: false });
      if (!alive.current || operation.current !== attempt) { media.getTracks().forEach(track => track.stop()); return; }
      stream.current?.getTracks().forEach(track => track.stop());
      stream.current = media;
      setCameraOpen(true);
    } catch { if (operation.current === attempt) setError("Não conseguimos abrir a câmera. Confira a permissão do navegador ou escolha uma fotografia."); }
    finally { cameraRequest.current = false; if (alive.current && operation.current === attempt) setCameraBusy(false); }
  }

  function capture() {
    if (!alive.current) return;
    const attempt = operation.current;
    const element = video.current;
    if (!element || element.videoWidth < 1) { setError("Aguarde a câmera mostrar a página antes de fotografar."); return; }
    const scale = Math.min(1, 2000 / Math.max(element.videoWidth, element.videoHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(element.videoWidth * scale);
    canvas.height = Math.round(element.videoHeight * scale);
    canvas.getContext("2d")?.drawImage(element, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      if (!alive.current || operation.current !== attempt) return;
      if (blob) void choosePicture(new File([blob], "pagina-biblica.jpg", { type: "image/jpeg" }));
      else setError("Não conseguimos preparar a fotografia. Tente novamente.");
    }, "image/jpeg", .95);
  }

  function cancel() {
    operation.current++;
    request.current?.abort();
    void worker.current?.terminate();
    worker.current = null;
    setBusy(false);
    setFinding(false);
    setStatus("Leitura interrompida. Você pode tentar novamente ou escrever o trecho.");
  }

  async function recognize() {
    if (!picture || busy) return;
    const attempt = ++operation.current;
    setBusy(true);
    setError("");
    setMatches(null);
    setProgress(0);
    try {
      let recognized: string;
      if (provider === "paddle") {
        if (picture.size > 4 * 1024 * 1024) throw new Error("Para usar o serviço de leitura, escolha uma imagem de até 4 MB. A opção neste aparelho aceita até 8 MB.");
        setStatus("Enviando a fotografia para o serviço de leitura escolhido…");
        const form = new FormData();
        form.append("image", picture);
        request.current = new AbortController();
        const response = await fetch("/api/multimodal/ocr", { method: "POST", body: form, signal: request.current.signal });
        const result = await response.json() as { text?: unknown; provider?: unknown; error?: string };
        if (!response.ok) throw new Error(result.error || "O serviço de leitura não respondeu. Tente a leitura neste aparelho.");
        if (result.provider !== "paddleocr" || typeof result.text !== "string") throw new Error("Não conseguimos conferir o texto recebido do serviço.");
        recognized = result.text;
      } else {
        setStatus("Preparando o leitor em português neste aparelho…");
        const { createWorker, PSM } = await import("tesseract.js");
        const base = new URL("/ocr/", window.location.origin).href;
        const engine = await createWorker("por", 1, {
          workerPath: `${base}worker.min.js`, corePath: `${base}core`, langPath: `${base}lang`, cacheMethod: "none",
          logger: message => {
            if (operation.current !== attempt) return;
            setStatus(statusNames[message.status] ?? "Preparando a leitura da página…");
            setProgress(Math.max(0, Math.min(1, message.progress || 0)));
          }
        });
        if (operation.current !== attempt) { await engine.terminate(); return; }
        worker.current = engine;
        await engine.setParameters({ tessedit_pageseg_mode: PSM.AUTO, preserve_interword_spaces: "1", user_defined_dpi: "300" });
        const result = await engine.recognize(picture);
        recognized = result.data.text;
        await engine.terminate();
        worker.current = null;
      }
      if (operation.current !== attempt) return;
      const trimmed = recognized.trim();
      if (!trimmed) throw new Error("Não encontramos palavras nesta imagem. Tente uma foto mais próxima, bem iluminada e sem cortar o trecho.");
      setText(trimmed.slice(0, 4000));
      setProgress(1);
      setStatus(trimmed.length > 4000 ? "Mostramos os primeiros 4.000 caracteres. Confira o trecho que deseja procurar." : "A leitura está pronta. Confira as palavras e os números antes de procurar a passagem.");
    } catch (failure) {
      if (operation.current === attempt) setError(failure instanceof Error ? failure.message : "Não conseguimos ler a fotografia. Tente outra imagem ou escreva a referência.");
    } finally {
      if (operation.current === attempt) {
        setBusy(false);
        void worker.current?.terminate();
        worker.current = null;
      }
    }
  }

  async function locate() {
    if (!text.trim() || finding) return;
    const attempt = ++operation.current;
    setFinding(true);
    setError("");
    setMatches(null);
    request.current = new AbortController();
    try {
      const response = await fetch("/api/multimodal/locate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }), signal: request.current.signal });
      const result = await response.json() as LocateResponse & { error?: string };
      if (!response.ok) throw new Error(result.error || "Não conseguimos procurar a passagem agora.");
      if (operation.current === attempt) setMatches(result);
    } catch (failure) {
      if (operation.current === attempt) setError(failure instanceof Error ? failure.message : "Não conseguimos procurar a passagem agora.");
    } finally { if (operation.current === attempt) setFinding(false); }
  }

  function changed(event: ChangeEvent<HTMLInputElement>) {
    void choosePicture(event.target.files?.[0]);
    event.target.value = "";
  }

  return <section className="passage-camera" data-passage-camera data-ocr-ready={ready} aria-labelledby={`${id}-title`}>
    <header className="pc-heading"><span aria-hidden="true"><Scan size={29} /></span><div><p>DA SUA PÁGINA PARA A PALAVRA ABERTA</p><h2 id={`${id}-title`}>Fotografe. Confira. Continue a leitura.</h2><p>Uma referência anotada, uma página da sua Bíblia ou um trecho no caderno podem encontrar seu lugar no estudo.</p></div></header>
    <div className="pc-workspace"><div className="pc-photo-column"><div className="pc-photo-actions"><button type="button" onClick={() => void openCamera()} disabled={!ready || cameraBusy || busy || finding}><Camera size={20} aria-hidden="true" />{cameraBusy ? "Abrindo câmera…" : "Usar a câmera"}</button><button type="button" onClick={() => fileInput.current?.click()} disabled={!ready || busy || finding}><FileImage size={20} aria-hidden="true" />Escolher fotografia</button><input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" disabled={!ready || busy || finding} onChange={changed} aria-label="Escolher fotografia da passagem" className="pc-file-input" /></div>
      {cameraOpen ? <div className="pc-camera-live"><video ref={video} playsInline muted autoPlay aria-label="Prévia da câmera para fotografar a passagem" /><div><button type="button" onClick={capture}><Camera size={20} aria-hidden="true" />Fotografar este trecho</button><button type="button" onClick={closeCamera} aria-label="Fechar câmera"><X size={20} aria-hidden="true" /></button></div></div> : preview ? <div className="pc-preview"><Image src={preview} alt="Fotografia escolhida para reconhecer uma passagem bíblica" width={1200} height={900} unoptimized /><span>Enquadre o trecho, deixe a página reta e evite reflexos.</span></div> : <div className="pc-empty-photo"><Camera size={47} aria-hidden="true" /><strong>Aproxime a página, com calma.</strong><p>Uma foto nítida ajuda a reconhecer as palavras. Você também pode escrever a referência ao lado.</p><span>JPEG, PNG ou WebP · até 8 MB</span></div>}
      {paddleAvailable && <fieldset className="pc-provider"><legend>Onde reconhecer esta fotografia?</legend><label><input type="radio" name={`${id}-provider`} checked={provider === "device"} disabled={busy} onChange={() => setProvider("device")} />Neste aparelho</label><label><input type="radio" name={`${id}-provider`} checked={provider === "paddle"} disabled={busy} onChange={() => setProvider("paddle")} />Serviço de leitura · PaddleOCR</label></fieldset>}
      {provider === "paddle" && <p className="pc-server-note">Ao reconhecer, a foto será enviada ao serviço de leitura configurado. O app não guarda a imagem. Para esta opção, use até 4 MB.</p>}
      <button className="pc-recognize" type="button" disabled={!picture || busy || finding || cameraOpen} onClick={() => void recognize()}><Scan size={21} aria-hidden="true" />{busy ? "Reconhecendo as palavras…" : "Reconhecer o texto da foto"}</button>
      {busy && <div className="pc-progress"><progress max={1} value={progress} aria-label="Progresso do reconhecimento da fotografia" /><button type="button" onClick={cancel}>Interromper leitura</button></div>}
      <p className="pc-status" role="status" aria-live="polite">{status}</p>
    </div><div className="pc-reading-column"><label htmlFor={`${id}-text`}>O que sua página nos mostrou?</label><p className="pc-review-note">Confira especialmente o nome do livro, o capítulo e o versículo. Você pode corrigir ou escrever aqui.</p><textarea id={`${id}-text`} value={text} maxLength={4000} rows={9} disabled={busy || finding} onChange={event => { setText(event.target.value); setMatches(null); }} placeholder="Por exemplo: João 3:16 ou Salmos 23" /><div className="pc-find-row"><span>{text.length.toLocaleString("pt-BR")} / 4.000</span><button type="button" onClick={() => void locate()} disabled={!text.trim() || busy || finding}><MagnifyingGlass size={20} aria-hidden="true" />{finding ? "Procurando a passagem…" : "Encontrar na Bíblia"}</button></div>
      {error && <p className="pc-error" role="alert">{error}</p>}
      {matches && <div className="pc-matches" data-ocr-method={matches.method}><p role="status">{matches.message}</p>{matches.candidates.map(match => <article key={`${match.bookId}.${match.chapter}.${match.verse}`} data-ocr-passage={`${match.bookId}.${match.chapter}.${match.verse}`}><p>{match.reason}</p><h3>{match.reference}</h3><blockquote>{match.verses.map(verse => <span key={verse.number}><sup>{verse.number}</sup>{verse.text}</span>)}</blockquote>{match.endVerse > match.verse + 2 && <small>Prévia do começo do trecho. O capítulo completo está disponível na Bíblia.</small>}<Link href={match.href} prefetch={false}>Abrir e conferir o contexto<ArrowRight size={19} aria-hidden="true" /></Link></article>)}{matches.candidates.length > 0 && <p className="pc-edition">{matches.edition}. A tradução da fotografia pode usar outras palavras.</p>}</div>}
    </div></div>
    <details className="pc-care"><summary>Como a fotografia e o texto são usados</summary><p>Na opção “Neste aparelho”, o reconhecimento usa Tesseract.js em português e acontece no navegador. A fotografia não é enviada ao servidor. Para encontrar a passagem, somente o texto que você confirmou é enviado ao próprio app, sem gravação em conta ou banco de dados.</p><p>O leitor pode trocar letras e números, especialmente em páginas curvas ou com duas colunas. As correspondências são sugestões para você conferir. Nenhum trecho é inventado: as prévias são recuperadas da edição bíblica identificada.</p><a href="/ocr/proveniencia.json" target="_blank" rel="noreferrer">Ferramentas, arquivos e licenças do reconhecimento</a></details>
  </section>;
}
