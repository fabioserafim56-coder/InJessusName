/**
 * Adapted from 21st.dev CircleProgress (MIT, Copyright (c) 2024 21st.dev).
 * Source pinned in THIRD_PARTY_NOTICES.md. Changes: bounded values, a flexible
 * radius, top origin, accessible labelling and our local typography/colors.
 */
import "./study-progress-ring.css";

export function StudyProgressRing({ progress, label = "Etapas percorridas nesta aula", size = 44 }: { progress: number; label?: string; size?: number }) {
  const value = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  const strokeWidth = 3;
  const center = size / 2;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.round(value * 100);
  return <span className="study-progress-ring" role="progressbar" aria-label={label} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} style={{ width: size, height: size }}>
    <svg aria-hidden="true" viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size }}>
      <circle className="study-ring-track" cx={center} cy={center} fill="transparent" r={radius} stroke="currentColor" strokeWidth={strokeWidth} />
      <circle className="study-ring-value" cx={center} cy={center} fill="transparent" r={radius} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={`${circumference}`} strokeDashoffset={`${circumference * (1 - value)}`} transform={`rotate(-90 ${center} ${center})`} />
    </svg>
    <span aria-hidden="true">{percent}%</span>
  </span>;
}
