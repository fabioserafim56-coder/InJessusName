import type { BiblicalStory } from "@/content/stories";

export function StorySymbol({ kind }: { kind: BiblicalStory["symbol"] }) {
  return <svg aria-hidden="true" viewBox="0 0 160 160" fill="none" className="story-symbol">
    <circle cx="80" cy="80" r="65" stroke="currentColor" opacity=".22" />
    <circle cx="80" cy="80" r="53" stroke="currentColor" strokeDasharray="2 8" opacity=".35" />
    {kind === "sprout" && <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M80 115V72M80 89C55 92 45 77 45 57c22-2 37 10 35 32ZM80 76c24 0 35-13 35-32-22 0-35 11-35 32Z" /><path d="m52 64 28 25m28-38L80 76M59 116h42" /></g>}
    {kind === "water" && <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M41 94c13-12 26 12 39 0s26 12 39 0M41 108c13-12 26 12 39 0s26 12 39 0M80 40C71 52 63 62 63 72a17 17 0 0 0 34 0c0-10-8-20-17-32Z" /></g>}
    {kind === "star" && <g stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"><path d="m80 38 9 30 31 12-31 11-9 31-10-31-30-11 30-12 10-30Z" /><path d="m45 41 3 10 10 3-10 4-3 10-4-10-10-4 10-3 4-10Zm70 67 3 9 9 3-9 3-3 10-4-10-9-3 9-3 4-9Z" /></g>}
    {kind === "road" && <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M42 122c-4-20 61-22 54-44S58 65 73 40M68 122c-6-15 53-22 45-45S81 64 89 40" /><path d="M52 46h10m-5-5v10M113 36h10m-5-5v10" /></g>}
  </svg>;
}
