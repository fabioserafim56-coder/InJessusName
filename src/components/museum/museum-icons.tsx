export function MuseumIcon({ name }: { name: "museum" | "search" | "arrow" | "zoom" | "location" | "time" | "book" | "close" | "spark" }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {name === "museum" && <><path d="m3 8 9-5 9 5H3Zm1 12h16M3 22h18M6 10v8m6-8v8m6-8v8" /></>}
    {name === "search" && <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>}
    {name === "arrow" && <path d="M4 12h16m-6-6 6 6-6 6" />}
    {name === "zoom" && <><circle cx="10" cy="10" r="6" /><path d="m15 15 6 6M7 10h6m-3-3v6" /></>}
    {name === "location" && <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" /><circle cx="12" cy="10" r="2.5" /></>}
    {name === "time" && <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>}
    {name === "book" && <><path d="M12 5C8 3 5 3 2 5v15c3-2 6-2 10 0 4-2 7-2 10 0V5c-3-2-6-2-10 0Zm0 0v15" /></>}
    {name === "close" && <path d="m6 6 12 12M18 6 6 18" />}
    {name === "spark" && <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z" />}
  </svg>;
}
