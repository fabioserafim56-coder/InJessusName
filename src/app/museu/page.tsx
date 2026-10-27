import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { MuseumGallery } from "@/components/museum/museum-gallery";
import { museumExhibits } from "@/content/museum";

export const metadata: Metadata = { title: "Museu da história bíblica — InJessusName", description: "Um caminho por peças e imagens do mundo bíblico, com contexto histórico, fontes e espaço para meditar." };

export default function MuseumPage() {
  return <AppShell active="museum" title="Museu bíblico" subtitle="Memória, história e fé"><MuseumGallery exhibits={museumExhibits} /></AppShell>;
}
