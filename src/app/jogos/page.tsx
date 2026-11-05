import type { Metadata } from "next";
import { FocusShell } from "@/components/focus-shell";
import { GamesHub } from "@/components/games/games-hub";
import { gameReferences, games, type GameReadings } from "@/content/games";
import { getBibleChapter, getBibleEdition } from "@/lib/bible";

export const metadata: Metadata = { title: "Jogos na Palavra | InJessusName", description: "Reconstrua relatos, conecte contextos e investigue passagens bíblicas com a Bíblia aberta e no seu tempo." };

export default async function GamesPage({ searchParams }: { searchParams: Promise<{ jogo?: string }> }) {
  const params = await searchParams;
  const initialGame = games.find(game => game.id === params.jogo)?.id ?? "caminho";
  const readings = Object.fromEntries(gameReferences.map(reference => {
    const chapter = getBibleChapter(reference.bookId, reference.chapter);
    if (!chapter) throw new Error(`Missing game passage: ${reference.id}`);
    return [reference.id, { ...reference, verses: chapter.verses.filter(verse => verse.number >= reference.start && verse.number <= reference.end) }];
  })) as GameReadings;
  const edition = getBibleEdition();
  return <FocusShell title="Jogos na Palavra" subtitle="Conhecer, praticar e guardar no coração" backHref="/aprender" backLabel="Voltar aos estudos" mainClassName="games-main">
    <GamesHub readings={readings} initialGame={initialGame} attribution={edition.attribution} sourceUrl={edition.sourceUrl} licenseUrl={edition.licenseUrl} />
  </FocusShell>;
}
