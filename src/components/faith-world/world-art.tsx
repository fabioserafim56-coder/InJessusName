import { motion, useReducedMotion } from "motion/react";
import { faithLands, faithLandStops, faithStopPosition } from "@/content/faith-journey";
import type { JourneyVisualProfile } from "@/components/journey-session";

export type FaithStop = { id: string; number: number; title: string; era: string; objective: string };

function Olive({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><ellipse cy="9" rx="24" ry="8" fill="#102e2630" /><path d="M-3 4 0-49 5-47 5 4Z" fill="#705f43" /><path d="M2-23-15-41M3-31 18-48" stroke="#756444" strokeWidth="4" /><ellipse cy="-51" rx="27" ry="21" fill="#496b4d" /><ellipse cx="-14" cy="-48" rx="20" ry="17" fill="#617e55" /><ellipse cx="13" cy="-57" rx="19" ry="16" fill="#779064" /><ellipse cx="-3" cy="-64" rx="17" ry="12" fill="#8b9c71" /><path d="m-23-47 11-7m9-9 9 5m9 10 9-4" stroke="#b2bc813a" strokeWidth="3" /></g>;
}

function House({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><path d="m-35-38 47-16 36 18-47 17Z" fill="#e9dfc0" /><path d="M-35-38v45L1 25v-44Z" fill="#bcac83" /><path d="M1-19v44L48 8v-44Z" fill="#d6c69e" /><path d="m-40-41 52-18 42 20-7 5-35-16-46 16Z" fill="#b6a17a" /><path d="M-22 6v-24q0-12 13-8v38Z" fill="#71674e" /><path d="M15-8v14l11-4v-14Z" fill="#8c8569" /><path d="m32-13 9-3v14l-9 4Z" fill="#8c8569" /><path d="m-32-31 29 14m8 5 41-14" stroke="#fff7d72e" strokeWidth="2" /></g>;
}

function Temple({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}><path d="m-77 3 101-35 77 40L0 44Z" fill="#c1ae85" /><path d="m-68-4 92-31 65 34L-3 31Z" fill="#e6d9b6" /><path d="M-49-57v63l53 28v-64Z" fill="#c3ad83" /><path d="M4-30v64l60-22v-63Z" fill="#e1d0a7" /><path d="m-56-66 63-24 66 35L9-31Z" fill="#f0e1b6" /><path d="M-56-66v12L9-19v-12Z" fill="#c6ab77" /><path d="m9-31 64-24v12L9-19Z" fill="#d9c08d" /><path d="M-32-40v45m21-35v46m28-37v45m23-53v45" stroke="#f8ecc8" strokeWidth="8" /><path d="M5-25v49l10-3v-50Z" fill="#8b8063" /><path d="m-43 24 45 24 79-27m-129 9 50 26 84-28" stroke="#c1ad82" strokeWidth="5" /></g>;
}

function Boat({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}><ellipse cy="12" rx="36" ry="8" fill="#2b748361" /><path d="m-33-1 64 1-17 18h-32Z" fill="#735a3a" /><path d="m-26 0 52 1-13 7h-27Z" fill="#bba477" /><path d="M0-4v-60" stroke="#6e6044" strokeWidth="3" /><path d="m-4-57-26 43H-4Z" fill="#faf0cc" /><path d="m5-50 22 37H5Z" fill="#d9cead" /></g>;
}

function Land({ index }: { index: number }) {
  const land = faithLands[index];
  const tones = ["#8da478", "#a3aa71", "#b8ad83", "#9ca47b", "#9aaa83", "#9eb99a"];
  return <g transform={`translate(${land.cx} ${land.cy})`} data-faith-land={land.theme}>
    <ellipse cy="66" rx="265" ry="85" fill="#0e362920" />
    <path d="M-276-21C-260-80-142-131-22-122 106-145 252-92 285-18L270 39C194 105-46 147-218 65L-274 18Z" fill="url(#fw-cliff)" />
    <path d="M-276-21C-260-80-142-131-22-122 106-145 252-92 285-18 254 53 81 115-85 86-192 89-273 38-276-21Z" fill={tones[index]} />
    <path d="M-258-18C-225-78-118-112-21-107 95-128 236-85 266-18" fill="none" stroke="#e1dfad4d" strokeWidth="5" />
    <path d="m-241 35 10 31m43-9 5 30m47-13 4 22m168-8-3 23m66-44-8 28m55-46-6 27m41-46-7 22" stroke="#455c3c55" strokeWidth="3" />
    <path d="M-187 14C-103-49-70 50 11 7S104 6 185-12" stroke="#e2d1a7" strokeWidth="28" fill="none" strokeLinecap="round" />
    <path d="M-187 14C-103-49-70 50 11 7S104 6 185-12" stroke="#b9a87d" strokeWidth="1.5" fill="none" strokeDasharray="3 10" />
    {index === 0 && <><path d="M-42-121C-98-87-138-71-125-35S-50 41-80 88" fill="none" stroke="#6aabb0" strokeWidth="30" /><path d="M-42-121C-98-87-138-71-125-35S-50 41-80 88" fill="none" stroke="#b3d1bd77" strokeWidth="3" /><Olive x={-186} y={-45} scale={1.05}/><Olive x={-40} y={-84}/><Olive x={193} y={-40} scale={1.2}/><path d="m66-62 28-39 32 38Z" fill="#d8c9a4" /><path d="m94-101 0 40 32-2Z" fill="#baad88" /><path d="M70-61v17h52v-17" fill="#9f9b72" /></>}
    {index === 1 && <><House x={-35} y={-55} scale={1.1}/><House x={45} y={-62} scale={.72}/><Olive x={-205} y={-41}/><Olive x={185} y={25} scale={.8}/><g stroke="#d4c17e" strokeWidth="2">{Array.from({ length: 14 }, (_, n) => <path key={n} d={`M${112 + n * 5} -35v-25m-3 7 3 5 3-7`}/>)}</g><path d="m-104 46 51-15 20 10-50 16Z" fill="#c8b990" /><ellipse cx="-72" cy="37" rx="15" ry="8" fill="#807a58" /></>}
    {index === 2 && <><Temple x={21} y={-30}/><Olive x={-190} y={-35}/><Olive x={199} y={5} scale={.9}/><path d="m-131 45 29-9 30 15-28 11Z" fill="#ddd1ad" /><path d="m-120 43 17 9 17-6" fill="none" stroke="#a58f62" strokeWidth="2" /><House x={128} y={-67} scale={.65}/></>}
    {index === 3 && <><ellipse cx="-108" cy="-30" rx="132" ry="73" fill="#6b9fa3" /><path d="M-220-34q80-55 196 0m-170 26q52-27 126-6m-81 40q32-12 60-3" stroke="#d3dec77a" strokeWidth="2" fill="none" /><Boat x={-105} y={-43}/><Olive x={193} y={-35} scale={1.3}/><path d="M65-45V-98m-18 19h36" stroke="#756b4d" strokeWidth="8" /><path d="M145 51v-28a30 24 0 0 1 59 0v28Z" fill="#b8ad88" /><path d="M157 50V28a17 15 0 0 1 34 0v22Z" fill="#777c60" /><ellipse cx="205" cy="44" rx="16" ry="20" fill="#c9bc96" /></>}
    {index === 4 && <><House x={-100} y={-53}/><House x={-21} y={-83} scale={.8}/><House x={70} y={-70} scale={.9}/><Olive x={203} y={-24}/><ellipse cx="92" cy="50" rx="42" ry="19" fill="#d4c79f" /><ellipse cx="92" cy="45" rx="33" ry="14" fill="#7ba8a1" /><path d="M67 42q25-10 52 0" stroke="#e6e4c077" strokeWidth="2" fill="none" /><path d="m-190 28 30-9 27 15-32 10Z" fill="#e0d2ab" /><ellipse cx="-162" cy="25" rx="9" ry="5" fill="#b59460" /></>}
    {index === 5 && <><path d="M-150-92Q-70-70-53-29T15 85" stroke="#86bdb2" strokeWidth="34" fill="none" /><path d="M-150-92Q-70-70-53-29T15 85" stroke="#d3ead26b" strokeWidth="4" fill="none" /><Olive x={-186} y={-35} scale={1.2}/><Olive x={176} y={-29} scale={1.25}/><Olive x={80} y={-79}/><Temple x={-20} y={-54}/><g fill="#e9d3a2">{[-127,-88,127,170,198].map((x,i)=><g key={x}><circle cx={x} cy={47-i*5} r="3"/><circle cx={x+9} cy={41-i*5} r="2"/></g>)}</g></>}
    <path d="M-202 52q15 6 22 0m110 16q15 5 22-1m145-18q18 4 25-4" stroke="#e3d3a84d" strokeWidth="2" fill="none" />
  </g>;
}

function Avatar({ profile, practiced, companion = false }: { profile: JourneyVisualProfile; practiced: number; companion?: boolean }) {
  const gray = profile.ageBand === "mature";
  const size = profile.ageBand === "child" ? .78 : profile.ageBand === "youth" ? .93 : 1;
  const robe = practiced >= 6 ? "#315f4e" : companion ? "#a38663" : "#b5a47d";
  return <g transform={`scale(${size})`}><ellipse cy="2" rx="18" ry="6" fill="#173e3540" />
    {practiced >= 6 && <path d="M-14-44q-9 8-11 39L1 4 15-6 11-43Z" fill="#23473c" />}
    <g className="fw-walking-feet"><path d="m-7-17-2 17h-8q-2-3 4-5l3-17" fill="#504a37" /><path d="m6-19 4 18h8q2-3-4-5L9-24" fill="#665640" /></g>
    <path d="M-11-45Q0-52 11-45L18-16Q2-7-16-16Z" fill={robe} /><path d="M-6-45 0-21 6-45" fill="#e3d6b2" /><path d="M-11-44-21-23-17-20-4-36m15-7 11 19-4 4L4-36" fill="#bc916e" />
    <path d="M-8-61q-5 15 0 22h16q5-15 0-22Z" fill={gray ? "#d4d0bc" : "#594c36"} />
    <ellipse cy="-55" rx="8" ry="10" fill="#bd906c" /><path d="M-8-56q-1-14 9-11 10 0 8 13-5-4-8-8-2 5-9 6Z" fill={gray ? "#ddd9ca" : "#4c4534"} />
    {profile.appearance === "feminine" && <path d="M-7-63q-9 9-7 24l7-2v-14m15-8q8 9 6 24l-6-3v-13" fill={gray ? "#d4d0bd" : "#594c36"} />}
    {profile.appearance === "neutral" && <path d="M-9-58q-3 10 0 16l-5-3q-1-13 3-18Z" fill={gray ? "#d4d0bd" : "#594c36"} />}
    {practiced >= 3 && <><path d="m-9-43 20 24" stroke="#6b583b" strokeWidth="3" /><path d="M9-25 21-23 21-9 9-11Z" fill="#8c6d44" /><path d="M12-25v-5h7v6" stroke="#c8b07c" strokeWidth="2" fill="none" /></>}
    {practiced >= 1 && !companion && <g transform="translate(-23 -16)"><circle r="19" fill="url(#fw-lantern-light)" /><path d="M-4-8h8l2 12H-6Z" fill="#bb985a" /><path d="M-2-5h4v6h-4Z" fill="#fff2b4" /><path d="M-3-9v-4h6v4" stroke="#8a7349" strokeWidth="2" fill="none" /></g>}
  </g>;
}

export function FaithWorldArt({ stages, selected, practiced, completedLessons, profile, viewBox, onSelect }: { stages: readonly FaithStop[]; selected: number; practiced: readonly string[]; completedLessons: number; profile: JourneyVisualProfile; viewBox: string; onSelect: (index: number) => void }) {
  const reduced = useReducedMotion();
  const point = faithStopPosition(selected);
  const route = stages.map((_,index) => faithStopPosition(index)).map((p,index)=>`${index ? "L" : "M"} ${p.x} ${p.y}`).join(" ");
  return <motion.svg className="fw-world-art" viewBox={viewBox} animate={{ viewBox }} initial={false} transition={{duration:reduced?0:.8,ease:[.22,1,.36,1]}} aria-label="Cenário do seu percurso bíblico" role="group">
    <defs><linearGradient id="fw-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#c3d8d0"/><stop offset="1" stopColor="#e7e3cb"/></linearGradient><linearGradient id="fw-cliff" x1="0" y1="0" x2=".3" y2="1"><stop stopColor="#7b825d"/><stop offset="1" stopColor="#4a6046"/></linearGradient><radialGradient id="fw-sun"><stop stopColor="#fff5cd"/><stop offset="1" stopColor="#fff5cd00"/></radialGradient><radialGradient id="fw-lantern-light"><stop stopColor="#fff1ac88"/><stop offset="1" stopColor="#fff1ac00"/></radialGradient></defs>
    <rect x="-2000" y="-1500" width="6000" height="4000" fill="url(#fw-sky)"/>
    <circle cx="-40" cy="-140" r="500" fill="url(#fw-sun)"/><path d="M-500 130q370-300 740-30t620-40 700 40 650-90" fill="none" stroke="#b1c8bc66" strokeWidth="160"/><path d="M-500 1120q280-160 620-70t680-30 700 50" fill="none" stroke="#a4c2b566" strokeWidth="120"/>
    <g opacity=".6" fill="#f6f2df"><ellipse cx="400" cy="55" rx="130" ry="20"/><ellipse cx="1120" cy="490" rx="100" ry="15"/><ellipse cx="70" cy="570" rx="100" ry="18"/><ellipse cx="1550" cy="810" rx="130" ry="20"/></g>
    <path d={route} fill="none" stroke="#7c826342" strokeWidth="27" strokeLinecap="round" strokeLinejoin="round"/><path d={route} fill="none" stroke="#c1b58b" strokeWidth="21" strokeLinecap="round" strokeLinejoin="round"/><path d={route} fill="none" stroke="#eee3bf" strokeWidth="2" strokeDasharray="2 12"/>
    {faithLands.map((land,index)=><Land key={land.theme} index={index}/>)}
    {stages.map((stage,index)=>{const p=faithStopPosition(index);const done=practiced.includes(stage.id);return <g key={stage.id} transform={`translate(${p.x} ${p.y})`} className={`fw-world-stop${selected===index?" fw-stop-selected":""}${done?" fw-stop-practiced":""}`} role="button" tabIndex={0} aria-label={`Caminhar até a etapa ${stage.number}: ${stage.title}`} aria-pressed={selected===index} onClick={()=>onSelect(index)} onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();onSelect(index);}}}><circle r="35" fill="transparent"/><ellipse cy="9" rx="24" ry="12" fill="#425e3945"/><ellipse cy="3" rx="24" ry="12" fill={done?"#294f3b":"#c7b68a"}/><ellipse rx="24" ry="12" fill={selected===index?"#f2df9f":done?"#467556":"#eee0b9"} stroke={selected===index?"#fff1bd":"#a9986f"} strokeWidth="2"/><text y="-30" textAnchor="middle" className="fw-stop-number">{String(stage.number).padStart(2,"0")}</text><text y="42" textAnchor="middle" className="fw-stop-name">{faithLandStops[index]}</text>{done&&<path d="m-6-1 4 4 8-8" fill="none" stroke="#fff8db" strokeWidth="3"/>}</g>;})}
    <motion.g className="fw-traveler" animate={{x:point.x,y:point.y-5}} initial={false} transition={{duration:reduced?0:.85,ease:[.22,1,.36,1]}} data-world-avatar data-avatar-practices={practiced.length} data-avatar-lessons={completedLessons}>
      {profile.company==="community"&&<><g transform="translate(-42 -2) scale(.85)"><Avatar profile={{...profile,appearance:"feminine"}} practiced={0} companion/></g><g transform="translate(38 9) scale(.83)"><Avatar profile={{...profile,appearance:"masculine",ageBand:"mature"}} practiced={0} companion/></g></>}
      {profile.company==="family"&&<><g transform="translate(37 0) scale(.92)"><Avatar profile={{...profile,appearance:profile.appearance==="feminine"?"masculine":"feminine",ageBand:"adult"}} practiced={0} companion/></g><g transform="translate(-31 9) scale(.7)"><Avatar profile={{...profile,appearance:"neutral",ageBand:"child"}} practiced={0} companion/></g></>}
      <g key={`${selected}-${profile.appearance}-${profile.ageBand}`} className="fw-avatar-walk"><Avatar profile={profile} practiced={practiced.length + completedLessons}/></g>
    </motion.g>
    <g pointerEvents="none">{faithLands.map(land=><g key={land.theme} transform={`translate(${land.cx} ${land.cy+126})`}><path d="M-129-15Q0-28 129-15v34Q0 32-129 19Z" fill="#f5eed9e8" stroke="#8f92654d"/><text textAnchor="middle" y="6" className="fw-land-name">{land.short}</text></g>)}</g>
  </motion.svg>;
}
