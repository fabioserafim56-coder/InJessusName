import type { Metadata } from "next";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { getCurrentUser } from "@/lib/supabase/server";
import "./onboarding.css";

export const metadata: Metadata = {
  title: "Seu primeiro passo — InJessusName",
  description: "Encontre um caminho de estudo bíblico e cristão que respeite a sua fase da vida e suas perguntas.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function BeginPage() {
  const user = await getCurrentUser();
  return <OnboardingFlow authenticated={Boolean(user)} />;
}
