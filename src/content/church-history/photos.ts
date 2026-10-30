import records from "./photos.json";

export type HistoryPhoto = Readonly<{
  id: string;
  entityIds: readonly string[];
  kind: "photograph" | "document" | "historical-portrait";
  title: string;
  caption: string;
  place: string;
  dateLabel: string;
  creator: string;
  credit: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  originalUrl: string;
  sourceFile: string;
  src: string;
  width: number;
  height: number;
  bytes: number;
  sha256: string;
  accessedAt: string;
  changes: string;
  rightsEvidence: string;
  captureDateRaw: string;
  metadataCategories: string;
}>;

export const historyPhotos = records as readonly HistoryPhoto[];

export function getHistoryPhotos(entityId: string): readonly HistoryPhoto[] {
  return historyPhotos.filter(photo => photo.entityIds.includes(entityId));
}

export function getHistoryCover(entityId: string): HistoryPhoto | undefined {
  return getHistoryPhotos(entityId)[0];
}
