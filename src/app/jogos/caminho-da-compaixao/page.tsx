import type { Metadata } from "next";
import { FocusShell } from "@/components/focus-shell";
import { JourneyGame } from "@/components/games3d/journey-game";
import { getBibleChapter } from "@/lib/bible";

export const metadata: Metadata = {
  title: "O caminho da compaixão — jornada 3D | InJessusName",
  description: "Explore uma paisagem 3D, caminhe e participe dos gestos de cuidado da parábola do bom samaritano, com Lucas 10 aberto ao seu lado.",
};

export default function CompassionJourneyPage() {
  const chapter = getBibleChapter("LUK", 10);
  if (!chapter) throw new Error("A leitura de Lucas 10 não está disponível.");
  return <FocusShell className="game3d-shell" mainClassName="game3d-main" title="O caminho da compaixão" subtitle="Uma jornada em Lucas 10" backHref="/jogos" backLabel="Todos os jogos">
    <JourneyGame verses={chapter.verses.filter(verse => verse.number >= 25 && verse.number <= 37)} edition={{ attribution: chapter.edition.attribution, licenseUrl: chapter.edition.licenseUrl, sourceUrl: chapter.edition.sourceUrl }} />
  </FocusShell>;
}
