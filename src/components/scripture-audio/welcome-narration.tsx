import { Headphones, Sparkle } from "@phosphor-icons/react/ssr";
import provenance from "../../../public/audio/bem-vindo-proveniencia.json";
import "./welcome-narration.css";

/** Pre-rendered authorial narration. No model or visitor text is sent to a TTS service. */
export function WelcomeNarration() {
  return <section className="scripture-welcome-audio" aria-labelledby="welcome-narration-title">
    <div className="swa-symbol" aria-hidden="true"><Headphones size={28} weight="duotone" /></div>
    <div className="swa-invitation"><p className="swa-kicker"><Sparkle size={15} aria-hidden="true" /> UM INSTANTE PARA CHEGAR</p><h2 id="welcome-narration-title">Há lugar para você nesta caminhada.</h2><p>Se desejar, escute uma palavra de acolhimento antes de abrir sua Bíblia.</p></div>
    <div className="swa-player"><audio controls preload="none" aria-label="Ouvir boas-vindas em português, narração sintética"><source src="/audio/bem-vindo-kokoro-ptbr.mp3" type="audio/mpeg" /><a href="/audio/bem-vindo-kokoro-ptbr.mp3">Ouvir a mensagem de boas-vindas</a></audio><span className="swa-disclosure">25 segundos · voz sintética em português</span></div>
    <details className="swa-transcript"><summary>Ler a mensagem e conhecer a narração</summary><div><p>{provenance.transcript}</p><p className="swa-origin">Texto autoral do InJessusName. Narração gerada antecipadamente com o modelo aberto Kokoro e uma voz brasileira do seu acervo. O áudio só toca quando você escolhe ouvir.</p><a href="/audio/bem-vindo-proveniencia.json" target="_blank" rel="noreferrer">Origem e detalhes do áudio</a></div></details>
  </section>;
}
