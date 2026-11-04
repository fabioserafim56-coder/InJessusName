import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import "./multimodal-hub.css";

export function MultimodalEntry() {
  return <aside className="multimodal-entry" aria-label="Outras formas de acompanhar a Palavra"><div><strong>Leia. Escute. Traga sua pergunta.</strong><p>Acompanhe a leitura narrada, encontre uma passagem pela câmera e explore as histórias com sua voz e seu olhar.</p></div><Link href="/explorar">Explorar a Palavra <ArrowRight size={19} aria-hidden="true" /></Link></aside>;
}
