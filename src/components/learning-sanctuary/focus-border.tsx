"use client";

// Adapted from Magic UI BorderBeam (MIT, copyright Magic UI).
// Pinned source and original license are documented beside this component.
// This cue runs once after an explicit choice, rather than looping continuously.
import { motion, useReducedMotion, type MotionStyle } from "motion/react";

export function SanctuaryFocusBorder({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  if (!active || reduced) return null;
  return <div className="ls-focus-border" aria-hidden="true"><motion.div style={{ width: 80, offsetPath: "rect(0 auto auto 0 round 16px)" } as MotionStyle} initial={{ offsetDistance: "0%", opacity: 0 }} animate={{ offsetDistance: ["0%", "10%", "85%", "100%"], opacity: [0, 1, 1, 0] }} transition={{ duration: 5, ease: "linear", times: [0, .1, .85, 1], repeat: 0 }} /></div>;
}
