import exhibits from "./exhibits.json";

export type MuseumExhibit = {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  approxDate: string;
  era: string;
  startYear: number;
  endYear: number;
  place: string;
  coordinates: { lat: number; lng: number };
  collection: string;
  objectType: string;
  image: {
    src: string;
    alt: string;
    credit: string;
    license: string;
    licenseUrl: string;
    sourceUrl: string;
    width: number;
    height: number;
    sha256: string;
  };
  introduction: string;
  story: readonly string[];
  whatItShows: readonly string[];
  limits: readonly string[];
  bibleConnections: readonly {
    book: string;
    chapter: number;
    startVerse: number;
    endVerse: number;
    label: string;
    explanation: string;
  }[];
  sources: readonly { label: string; url: string }[];
  reflectionPrompt: string;
};

export const museumExhibits: readonly MuseumExhibit[] = exhibits;

export function getMuseumExhibit(id: string) {
  return museumExhibits.find((exhibit) => exhibit.id === id);
}
