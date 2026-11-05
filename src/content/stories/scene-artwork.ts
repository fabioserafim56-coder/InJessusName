import type { BiblicalStory } from ".";
import { getStoryArtwork } from "./artwork";

/** Scene art accompanies the written account; it never supplies historical evidence. */
export type StorySceneArtwork = Readonly<{
  src: string;
  position?: string;
  alt: string;
  provenance?: string;
  width?: number;
  height?: number;
}>;

// Story IDs and zero-based scene indices. Every override must belong to its passage.
export const storySceneArtwork: Readonly<Record<string, Readonly<Record<number, StorySceneArtwork>>>> = {
  "multiplicacao-dos-paes": {
    1: { src: "/visuals/scenes/joao-6-oferta.png", width: 1536, height: 1024, position: "58% center", alt: "Ilustração artística de João 6:9–10: um menino apresenta cinco pães e dois peixes junto aos discípulos e a Jesus.", provenance: "/visuals/scenes/proveniencia.json" },
    2: { src: "/visuals/scenes/joao-6-recolher.png", width: 1536, height: 1024, alt: "Ilustração artística de João 6:11–13: discípulos recolhem em cestos o alimento que sobrou entre a multidão.", provenance: "/visuals/scenes/proveniencia.json" },
  },
  "jesus-acalma-a-tempestade": {
    2: { src: "/visuals/scenes/marcos-4-calmaria.png", width: 1536, height: 1024, alt: "Ilustração artística de Marcos 4:39: Jesus e os discípulos no barco diante do mar em calmaria.", provenance: "/visuals/scenes/proveniencia.json" },
  },
  "bom-samaritano": {
    2: { src: "/visuals/scenes/lucas-10-cuidado.png", width: 1536, height: 1024, alt: "Ilustração artística da parábola em Lucas 10:33–35: o samaritano se aproxima e cuida do homem ferido à beira do caminho.", provenance: "/visuals/scenes/proveniencia.json" },
  },
};

export function getStorySceneArtwork(story: BiblicalStory, sceneIndex: number): StorySceneArtwork {
  const original = getStoryArtwork(story.image || `/visuals/stories-${story.art}.png`);
  return storySceneArtwork[story.id]?.[sceneIndex] ?? {
    ...(original || {}),
    src: story.image || `/visuals/stories-${story.art}.png`,
    position: ["50% center", "44% center", "56% center", "50% center"][sceneIndex] || "center",
    alt: `Ilustração artística para a história: ${story.subtitle}. A composição acompanha a passagem e não é uma reconstrução histórica.`,
  };
}
