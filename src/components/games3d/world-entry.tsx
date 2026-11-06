import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cube, GameController, Hand, PersonSimpleWalk } from "@phosphor-icons/react/ssr";
import "./world-entry.css";

export function GameWorldEntry() {
  return <section className="world-entry" aria-labelledby="world-entry-title">
    <div className="world-entry-art"><Image src="/games3d/caminho-da-compaixao.png" alt="Captura real do cenário 3D da jornada: personagem, estrada, oliveiras e hospedaria." fill quality={100} sizes="(max-width:760px) 100vw, 50vw" /><span>CENÁRIO DO JOGO · ADAPTAÇÃO ARTÍSTICA DA PARÁBOLA</span></div>
    <div className="world-entry-copy"><p className="world-entry-eyebrow"><Cube size={18} aria-hidden="true" /> EXPLORAÇÃO EM 3D</p><h2 id="world-entry-title">A compaixão começa<br />quando você se aproxima.</h2><p>Entre na estrada, controle seus passos e acompanhe o cuidado com o viajante. Há uma paisagem para explorar e uma Palavra que dá sentido a cada gesto.</p><ul><li><PersonSimpleWalk size={18} aria-hidden="true" /> Caminhe pelo cenário</li><li><Hand size={18} aria-hidden="true" /> Interaja e acompanhe</li><li><GameController size={18} aria-hidden="true" /> Teclado ou toque</li></ul><Link href="/jogos/caminho-da-compaixao" prefetch={false}>Conhecer a jornada 3D <ArrowRight size={20} aria-hidden="true" /></Link><small>Inspirada em Lucas 10:25–37 · Interpretação artística da parábola</small></div>
  </section>;
}
