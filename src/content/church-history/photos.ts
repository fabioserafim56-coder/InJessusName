import records from "./photos.json";
import renditionRecords from "./photo-renditions.json";

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

export type HistoryPhotoResource = Readonly<{ src: string; width: number; height: number }>;
export type HistoryPhotoRendition = HistoryPhotoResource & Readonly<{
  photoId: string;
  bytes: number;
  sha256: string;
  sourceSha256: string;
}>;

export const historyPhotoRenditions = renditionRecords.files as readonly HistoryPhotoRendition[];

export function getHistoryPhotoRenditions(photoId: string): readonly HistoryPhotoRendition[] {
  return historyPhotoRenditions.filter(file => file.photoId === photoId);
}

/** Use a prepared file so a hosting optimizer cannot silently deliver the huge original. */
export function getHistoryPhotoViewer(photo: HistoryPhoto, maximumWidth: number): HistoryPhotoResource {
  if (photo.width <= maximumWidth) return photo;
  return getHistoryPhotoRenditions(photo.id).filter(file => file.width <= maximumWidth).at(-1) || photo;
}

export function getHistoryPhotoCard(photo: HistoryPhoto): HistoryPhotoResource {
  return getHistoryPhotoViewer(photo, 1440);
}

export function getHistoryPhotos(entityId: string): readonly HistoryPhoto[] {
  return historyPhotos.filter(photo => photo.entityIds.includes(entityId));
}

export function getHistoryCover(entityId: string): HistoryPhoto | undefined {
  return getHistoryPhotos(entityId)[0];
}
