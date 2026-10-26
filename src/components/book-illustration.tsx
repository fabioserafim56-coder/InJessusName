export function BookIllustration() {
  return (
    <div className="book-illustration" aria-hidden="true">
      <div className="illustration-orbit orbit-one" />
      <div className="illustration-orbit orbit-two" />
      <span className="illustration-star star-one">✦</span>
      <span className="illustration-star star-two">✧</span>
      <div className="illustration-note">
        <span className="note-line" />
        <span>Há uma história<br /><strong>para conhecer.</strong></span>
      </div>
      <svg className="book-art" viewBox="0 0 580 500" fill="none">
        <defs>
          <linearGradient id="sky" x1="285" y1="55" x2="285" y2="320" gradientUnits="userSpaceOnUse"><stop stopColor="#E5E8DA" /><stop offset="1" stopColor="#F0EDDC" /></linearGradient>
          <linearGradient id="bookLeft" x1="135" y1="305" x2="297" y2="420" gradientUnits="userSpaceOnUse"><stop stopColor="#FFFEF7" /><stop offset="1" stopColor="#E9E5D5" /></linearGradient>
          <linearGradient id="bookRight" x1="300" y1="365" x2="439" y2="320" gradientUnits="userSpaceOnUse"><stop stopColor="#E4DFCD" /><stop offset=".28" stopColor="#FAF8ED" /><stop offset="1" stopColor="#FFFDF5" /></linearGradient>
          <linearGradient id="hill" x1="298" y1="190" x2="298" y2="365" gradientUnits="userSpaceOnUse"><stop stopColor="#91A08B" /><stop offset="1" stopColor="#637B63" /></linearGradient>
          <filter id="bookShadow" x="45" y="230" width="510" height="265" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="15" /></filter>
          <clipPath id="arch"><path d="M148 309V180a142 142 0 0 1 284 0v129H148Z" /></clipPath>
        </defs>

        <path d="M134 306V180a156 156 0 0 1 312 0v126" stroke="#C0C6AF" strokeWidth="1" />
        <path d="M148 309V180a142 142 0 0 1 284 0v129H148Z" fill="url(#sky)" />
        <g clipPath="url(#arch)">
          <circle cx="337" cy="141" r="35" fill="#D8BC7B" />
          <circle cx="337" cy="141" r="47" stroke="#D8BC7B" strokeOpacity=".3" />
          <path d="m100 280 88-99 111 131 79-78 97 87H100v-41Z" fill="#B1BA9F" />
          <path d="m87 318 143-100 77 68 68-31 105 80H87v-17Z" fill="url(#hill)" />
          <path d="M100 329c55-39 111-18 164-7 62 13 86-38 143-22l74 30v57H100v-58Z" fill="#536F57" />
          <path d="M309 273c-20 10-36 26-24 38s37 20 18 42" stroke="#E1D9BC" strokeWidth="9" />
          <path d="m212 150 6-3 6 3m12 9 5-3 5 3" stroke="#7C8B72" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        <g stroke="#7C9070" strokeWidth="2" strokeLinecap="round">
          <path d="M100 328c-26-48-20-94-6-128m392 131c21-34 26-72 17-103" />
          <path d="M92 245c-24-2-31-17-31-17 22-1 30 17 30 17Zm-7 26c-24-2-34-16-34-16 24-4 34 16 34 16Zm2 25c-22 0-34-11-34-11 22-6 34 11 34 11Zm6-48c-7-22 5-37 5-37 11 20-5 37-5 37Zm-5 28c3-25 18-33 18-33 3 24-18 33-18 33Zm8 30c3-23 21-29 21-29-1 22-21 29-21 29Z" fill="#8FA080" stroke="none" />
          <path d="M505 263c18-6 22-19 22-19-20 2-22 19-22 19Zm-2 25c22-5 29-20 29-20-24 1-29 20-29 20Zm-10 24c21-3 30-15 30-15-23-2-30 15-30 15Zm12-52c3-20-11-31-11-31-7 20 11 31 11 31Zm-5 28c-1-20-16-29-16-29-4 21 16 29 16 29Z" fill="#A4AD8D" stroke="none" />
        </g>

        <ellipse cx="293" cy="401" rx="197" ry="27" fill="#5D6550" opacity=".17" filter="url(#bookShadow)" />
        <path d="m88 345 196 72c7 5 17 5 25 0l188-71-11 37-175 66c-9 5-20 5-29 0l-181-67-13-37Z" fill="#2D4B3A" />
        <path d="m95 339 192 72c7 4 13 5 21 0l180-68-8 27-172 66c-7 4-13 4-20 0l-184-68-9-29Z" fill="#C7BA90" />
        <path d="m101 337 189 70c5 3 11 3 16 0l176-66-4 20-173 66c-5 3-10 2-14 0l-185-69-5-21Z" fill="#F2EAD2" />
        <path d="m108 331 181 69c5 3 11 3 16 0l171-65" stroke="#C6B992" />
        <path d="m106 348 184 69c5 3 11 4 16 0l173-65" stroke="#D3C7A5" />
        <path d="M293 392c-46-41-116-49-184-66l25-87c64 8 126 24 165 65l-6 88Z" fill="url(#bookLeft)" />
        <path d="M299 304c45-39 98-58 161-64l23 86c-65 12-127 29-190 66l6-88Z" fill="url(#bookRight)" />
        <path d="M299 306c-1 26-5 58-6 86" stroke="#B9B49D" strokeWidth="1.3" />
        <path d="M134 239c64 8 126 24 165 65 45-39 98-58 161-64" stroke="#FFFDF6" strokeWidth="2" />
        <g stroke="#C5C3AF" strokeWidth="1.5" strokeLinecap="round" opacity=".8">
          <path d="M156 271c41 7 80 21 112 44m-117-32c42 7 79 21 114 44m-119-32c42 8 78 21 118 45m-122-34c42 8 80 21 120 44m-123-33c42 8 80 21 122 44m67-44c31-20 65-32 102-40m-101 52c32-20 66-32 104-41m-103 53c33-20 68-33 107-42m-105 54c34-20 69-33 108-43m-106 55c36-21 70-34 110-44" />
        </g>
        <path d="m315 313-5 107-15 14-4-13 9-114" fill="#BD975B" />
        <path d="m300 307 15 6" stroke="#D6B87B" />
        <circle cx="427" cy="74" r="3" fill="#B79D62" />
        <path d="M172 94h9m-4.5-4.5v9m257 124h8m-4-4v8" stroke="#AF9F77" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div className="illustration-caption">
        <span className="caption-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 21s-8-4.8-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.2-8 11-8 11Z" /></svg></span>
        <span>Conhecimento que encontra<br /><strong>lugar na sua vida.</strong></span>
      </div>
      <div className="illustration-bottom-label"><span /> DA CRIAÇÃO AOS DIAS DE HOJE</div>
    </div>
  );
}
