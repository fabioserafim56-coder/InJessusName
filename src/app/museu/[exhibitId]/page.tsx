import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ExhibitDetail } from "@/components/museum/exhibit-detail";
import { museumExhibits } from "@/content/museum";

export function generateStaticParams() { return museumExhibits.map((exhibit) => ({ exhibitId: exhibit.id })); }

export async function generateMetadata({ params }: { params: Promise<{ exhibitId: string }> }): Promise<Metadata> {
  const { exhibitId } = await params;
  const exhibit = museumExhibits.find((item) => item.id === exhibitId);
  return { title: exhibit ? `${exhibit.title} — Museu InJessusName` : "Peça não encontrada — InJessusName", description: exhibit?.subtitle };
}

export default async function MuseumExhibitPage({ params }: { params: Promise<{ exhibitId: string }> }) {
  const { exhibitId } = await params;
  const exhibit = museumExhibits.find((item) => item.id === exhibitId);
  if (!exhibit) notFound();
  const related = museumExhibits.filter((item) => item.id !== exhibit.id).slice(0, 3);
  return <AppShell active="museum" title="Museu bíblico" subtitle={exhibit.title}><ExhibitDetail exhibit={exhibit} related={related} /></AppShell>;
}
