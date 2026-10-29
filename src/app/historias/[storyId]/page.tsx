import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { StoryDetail } from "@/components/stories/story-detail";
import { biblicalStories, getBiblicalStory } from "@/content/stories";

export function generateStaticParams(){return biblicalStories.map(story=>({storyId:story.id}));}
export async function generateMetadata({params}:{params:Promise<{storyId:string}>}):Promise<Metadata>{const{storyId}=await params;const story=getBiblicalStory(storyId);return{title:story?`${story.title} — Histórias InJessusName`:"História não encontrada — InJessusName",description:story?.introduction};}
export default async function StoryPage({params}:{params:Promise<{storyId:string}>}){const{storyId}=await params;const story=getBiblicalStory(storyId);if(!story)notFound();return <AppShell active="stories" title="Histórias bíblicas" subtitle={story.subtitle}><StoryDetail story={story}/></AppShell>;}
