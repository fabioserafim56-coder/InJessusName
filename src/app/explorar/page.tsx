import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { MultimodalHub, type ExplorationMode } from "@/components/multimodal/multimodal-hub";

export const metadata: Metadata = {
  title: "Explorar a Palavra — InJessusName",
  description: "Escute a leitura, traga sua pergunta, encontre uma passagem pela câmera e explore histórias e registros bíblicos."
};

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ modo?: string }> }) {
  const { modo } = await searchParams;
  const allowed = ["ouvir", "perguntar", "camera", "contar", "historias", "museu"];
  const initialMode = allowed.includes(modo || "") ? modo as ExplorationMode : "ouvir";
  return <AppShell active="explore" title="Explorar a Palavra" subtitle="Uma leitura que encontra sua voz e seu olhar."><MultimodalHub initialMode={initialMode} /></AppShell>;
}
