import { HandsPraying } from "@phosphor-icons/react/ssr";
import provenance from "../../../public/audio/antes-do-estudo-proveniencia.json";
import "./study-prayer.css";

export function StudyPrayerAudio() {
  return <section className="study-prayer-audio" aria-labelledby="study-prayer-title"><div className="spa-invitation"><span aria-hidden="true"><HandsPraying size={27} /></span><div><p>SE DESEJAR, ORE CONOSCO</p><h2 id="study-prayer-title">Senhor, abre nossos olhos à tua Palavra.</h2><p>Um instante para entregar este encontro a Deus. Você também pode orar com suas próprias palavras, em silêncio.</p></div></div><div className="spa-player"><audio controls preload="none" aria-label="Ouvir oração antes do estudo, voz sintética"><source src="/audio/antes-do-estudo-kokoro-ptbr.mp3" type="audio/mpeg" /><a href="/audio/antes-do-estudo-kokoro-ptbr.mp3">Ouvir a oração antes do estudo</a></audio><small>{Math.round(provenance.durationSeconds)} segundos · oração autoral · voz sintética brasileira</small></div><details><summary>Ler a oração</summary><p>{provenance.transcript}</p><a href="/audio/antes-do-estudo-proveniencia.json" target="_blank" rel="noreferrer">Origem e detalhes da narração</a></details></section>;
}
