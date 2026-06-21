// Game404.tsx — PLACEHOLDER (filled in W-2).
//
// W-1 ships ONLY the static <NotFound404> shell. The interactive canvas game is
// W-2's deliverable: a flag-gated, dynamically-imported client island
// ('use client', single rAF engine, visibility/blur pause, DPR cap, in-effect
// localStorage, getComputedStyle palette, reduced-motion JS guard). It mounts
// into <NotFound404>'s aria-hidden canvas slot via the `gameSlot` prop.
//
// This stub exists so:
//   - package.json `exports["./Game404"]` resolves today (W-3/W-4 wiring can
//     reference the subpath without a build error before W-2 lands), and
//   - the static shell remains the no-JS / mobile / reduced-motion floor: a
//     consumer that does NOT pass `gameSlot` renders the pure shell, untouched.
//
// It renders nothing. Do NOT add engine logic here — that is W-2.

export default function Game404(): null {
  return null
}
