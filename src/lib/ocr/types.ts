export type LocatedPassage = Readonly<{
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  endVerse: number;
  reference: string;
  href: string;
  reason: string;
  verses: readonly { number: number; text: string }[];
}>;

export type LocateResponse = Readonly<{
  method: "reference" | "text" | "none";
  candidates: readonly LocatedPassage[];
  message: string;
  edition: string;
}>;
