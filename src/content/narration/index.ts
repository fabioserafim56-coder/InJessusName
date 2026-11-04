import recordings from "./recordings.json";

export type NarratedVerse = Readonly<{ number: number; text: string; src: string; durationSeconds: number; bytes: number; sha256: string }>;
export type NarratedPassage = Readonly<{
  id: string; title: string; introduction: string; bookId: string; bookName: string;
  chapter: number; startVerse: number; endVerse: number; storyIds: readonly string[];
  reference: string; verses: readonly NarratedVerse[];
}>;

export const narratedPassages = recordings.passages as readonly NarratedPassage[];
export const narrationEdition = recordings.edition;
export const narrationVoice = recordings.voice;

export function getNarratedPassageForReference(bookId: string, chapter: number, verse?: number): NarratedPassage | undefined {
  return narratedPassages.find(passage => passage.bookId === bookId && passage.chapter === chapter && (verse === undefined || (verse >= passage.startVerse && verse <= passage.endVerse)));
}

export function getNarratedPassageForStory(storyId: string): NarratedPassage | undefined {
  return narratedPassages.find(passage => passage.storyIds.includes(storyId));
}
