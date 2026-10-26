import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LearningPathView } from "@/components/learning-path-view";
import { buildLearningPath, type AgeBand } from "@/lib/learning-path";

const publicExperiences = {
  infantil: "6_9",
  ponte: "10_12",
  jovens: "13_17",
  adultos: "18_plus"
} as const satisfies Record<string, AgeBand>;

export const metadata: Metadata = {
  title: "Seu caminho de estudo — InJessusName",
  description: "Explore uma proposta de estudo bíblico e conhecimento cristão adequada à faixa etária, sem criar um perfil religioso."
};

export function generateStaticParams() {
  return Object.keys(publicExperiences).map((experience) => ({ experience }));
}

export default async function PublicLearningPath({
  params
}: {
  params: Promise<{ experience: string }>;
}) {
  const { experience } = await params;
  if (!Object.hasOwn(publicExperiences, experience)) notFound();
  const ageBand = publicExperiences[experience as keyof typeof publicExperiences];
  const path = buildLearningPath({
    ageBand,
    traditionCode: null,
    baptismStatus: "not_informed",
    goal: "bible_foundations"
  });

  return <LearningPathView path={path} />;
}
