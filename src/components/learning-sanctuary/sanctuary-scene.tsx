/** Original vector composition: a quiet study room, not a photograph of a church. */
export function SanctuaryScene() {
  return <svg className="sanctuary-scene" viewBox="0 0 850 700" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="san-wall" x1="700" y1="70" x2="260" y2="650" gradientUnits="userSpaceOnUse"><stop stopColor="#6c7859"/><stop offset=".55" stopColor="#324d3c"/><stop offset="1" stopColor="#142e27"/></linearGradient>
      <linearGradient id="san-sky" x1="530" y1="80" x2="530" y2="470" gradientUnits="userSpaceOnUse"><stop stopColor="#8dada6"/><stop offset=".48" stopColor="#e8d3a1"/><stop offset="1" stopColor="#f5e7bc"/></linearGradient>
      <linearGradient id="san-stone" x1="200" y1="140" x2="640" y2="520" gradientUnits="userSpaceOnUse"><stop stopColor="#c4b67f"/><stop offset=".5" stopColor="#dacc9f"/><stop offset="1" stopColor="#6f7756"/></linearGradient>
      <linearGradient id="san-floor" x1="400" y1="430" x2="400" y2="700" gradientUnits="userSpaceOnUse"><stop stopColor="#63735b"/><stop offset="1" stopColor="#183c30"/></linearGradient>
      <linearGradient id="san-paper" x1="360" y1="435" x2="550" y2="545" gradientUnits="userSpaceOnUse"><stop stopColor="#fffbdf"/><stop offset=".6" stopColor="#e6d4a5"/><stop offset="1" stopColor="#bc9e62"/></linearGradient>
      <linearGradient id="san-ray" x1="590" y1="135" x2="180" y2="670" gradientUnits="userSpaceOnUse"><stop stopColor="#fff0bd" stopOpacity=".4"/><stop offset="1" stopColor="#edd6a0" stopOpacity="0"/></linearGradient>
      <radialGradient id="san-glow" cx="0" cy="0" r="1" gradientTransform="translate(585 205) rotate(90) scale(270 290)" gradientUnits="userSpaceOnUse"><stop stopColor="#f5e9c2" stopOpacity=".18"/><stop offset="1" stopColor="#e5d09b" stopOpacity="0"/></radialGradient>
      <clipPath id="san-window"><path d="M414 426V226a122 122 0 0 1 244 0v200H414Z"/></clipPath>
      <pattern id="san-texture" width="13" height="13" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".5" fill="#e8d9aa" opacity=".12"/><circle cx="9" cy="8" r=".45" fill="#081f19" opacity=".2"/></pattern>
    </defs>
    <path d="M0 0h850v700H0z" fill="url(#san-wall)"/>
    <path d="M0 0h850v700H0z" fill="url(#san-texture)"/>
    <path d="M0 470 850 426v274H0V470Z" fill="url(#san-floor)"/>
    <g stroke="#b7b68b" strokeOpacity=".17" strokeWidth="1.1"><path d="m540 420-475 280m475-280-260 280m260-280-40 280m40-280 170 280m-170-280 340 263M0 530l850-34M0 610l850-39M0 687l850-26"/></g>
    <path d="M393 440V224a143 143 0 0 1 286 0v216H393Z" fill="#132d24" stroke="#d3c594" strokeWidth="1.5"/>
    <path d="M404 432V225a132 132 0 0 1 264 0v207H404Z" fill="url(#san-stone)"/>
    <g clipPath="url(#san-window)"><path d="M414 80h244v346H414z" fill="url(#san-sky)"/><path d="m400 342 73-53 57 22 65-51 80 64v118H400V342Z" fill="#6c8f84"/><path d="m400 365 71-38 43 23 52-37 109 47v82H400v-77Z" fill="#577e6d"/><path d="M398 377h300v79H398z" fill="#819e8a"/><path d="m414 397 63-12 48 5 45-9 88 9v49H414v-42Z" fill="#d6d4a9"/><path d="m521 389 23-3 20 3" stroke="#f7e8bb" strokeWidth="1.2"/><path d="M536 106v327m-122-167h244" stroke="#bca66d" strokeWidth="7"/><path d="M538 108v324m-121-168h241" stroke="#f7e4af" strokeWidth="1.5" strokeOpacity=".65"/></g>
    <path d="M396 433h283v13H396z" fill="#b5b289"/><path d="M384 445h307v10H384z" fill="#455941"/><path d="M389 454h298v6H389z" fill="#102c23" opacity=".4"/>
    <g fill="url(#san-stone)"><path d="M209 88h23v405h-23z"/><path d="M191 82h59v15h-59zM196 96h49v11h-49zM198 492h45v15h-45zM188 507h65v13h-65z"/><path d="M731 88h23v405h-23z"/><path d="M713 82h59v15h-59zM718 96h49v11h-49zM720 492h45v15h-45zM710 507h65v13h-65z"/></g>
    <g stroke="#304e3a" strokeOpacity=".35"><path d="M215 108v381m7-381v381m515-381v381m7-381v381"/></g>
    <path d="M232 84C365-28 610-28 732 84" stroke="#d3c390" strokeWidth="13"/><path d="M238 91C368-18 606-18 726 91" stroke="#455b40" strokeWidth="8"/>
    <path d="m525 115 51 24-231 527-227-2L525 115Z" fill="url(#san-ray)"/><path d="m604 159 43 43-119 462-100 18 176-523Z" fill="url(#san-ray)" opacity=".45"/>
    <path d="M0 0h850v700H0z" fill="url(#san-glow)"/>
    <ellipse cx="432" cy="590" rx="221" ry="31" fill="#0b231d" opacity=".34"/>
    <path d="m237 500 382-25 79 50-400 34-61-59Z" fill="#82643d"/><path d="m237 500 61 48 400-31v17l-400 34-61-59v-9Z" fill="#4c422c"/><path d="m305 568 17-1-7 113-15 1 5-113Zm330-27 16-2 13 105-14 2-15-105Z" fill="#3a3929"/><path d="m330 572 288-25" stroke="#ba9d63" strokeOpacity=".3"/>
    <path d="m307 488 124-30 112-2 75 49-141 26-170-43Z" fill="#263a2b" stroke="#b59c65" strokeWidth="2"/>
    <path d="m311 481 116-31c16-5 29-3 44 6 21-14 45-22 66-9l70 49-137 28-159-43Z" fill="#bca66e"/>
    <path d="m315 472 106-31c18-4 34 0 50 11 21-17 42-22 63-11l69 48-135 27-153-44Z" fill="url(#san-paper)"/>
    <path d="m470 453-2 64m-47-75 46 66m68-65-61 65" stroke="#907c4b" strokeOpacity=".45"/>
    <g stroke="#a28d5d" strokeWidth="1" strokeOpacity=".42"><path d="m343 467 75-21m-65 26 74-20m-62 24 70-18m-58 22 66-17m-55 21 61-15m-48 20 53-14m72-25 37 27m-46-22 38 27m-49-22 39 28m-49-22 40 28m-49-22 42 28"/></g>
    <path d="m471 513 10-3 15 74-9-8-6 12-10-75Z" fill="#b59956"/>
    <path d="M264 472c-1-11 3-22 11-27 6 8 8 17 3 27h-14Z" fill="#eacb86"/><path d="M256 475c0-10 32-10 32 0v17c-6 7-27 8-32 0v-17Z" fill="#ad8c54"/><ellipse cx="272" cy="475" rx="16" ry="5" fill="#e9c990"/>
    <g stroke="#698361" strokeWidth="2" strokeLinecap="round"><path d="M764 624c-8-85-35-150-84-201M752 570l34-45m-48 0-22-47m37 90-36-16m21-29 30-25"/></g>
    <g fill="#6e845d"><ellipse cx="690" cy="437" rx="9" ry="23" transform="rotate(-37 690 437)"/><ellipse cx="712" cy="477" rx="9" ry="24" transform="rotate(-23 712 477)"/><ellipse cx="774" cy="503" rx="9" ry="25" transform="rotate(33 774 503)"/><ellipse cx="785" cy="527" rx="9" ry="25" transform="rotate(37 785 527)"/><ellipse cx="717" cy="550" rx="9" ry="24" transform="rotate(-54 717 550)"/><ellipse cx="755" cy="594" rx="10" ry="23" transform="rotate(-12 755 594)"/></g>
    <path d="M729 617h75l-12 69h-52l-11-69Z" fill="#83724d"/><ellipse cx="767" cy="617" rx="38" ry="9" fill="#ad9763"/><ellipse cx="767" cy="617" rx="32" ry="6" fill="#3b4c32"/>
  </svg>;
}
