import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { StoryGallery } from "@/components/stories/story-gallery";

export const metadata:Metadata={title:"Histórias bíblicas ilustradas — InJessusName",description:"Quinze histórias, sessenta cenas e um fio de leitura: conheça o contexto, acompanhe as conexões e abra as passagens na Bíblia."};
export default function StoriesPage(){return <AppShell active="stories" title="Histórias bíblicas" subtitle="Ver, compreender e voltar à Palavra"><StoryGallery/></AppShell>;}
