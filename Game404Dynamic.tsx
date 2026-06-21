'use client'

// Game404Dynamic.tsx — the consumer-facing dynamic wrapper for the game island.
//
// WHY this exists (Option A, decided in W-2):
// The consumer not-found.tsx files (W-3 apps/web, W-4 outer-3) are SERVER
// components — kept server-rendered for real-404 discipline (a streamed 200 would
// silently lose the noindex header). Next 16's `next/dynamic({ ssr:false })` is
// NOT allowed in a Server Component (it errors: "ssr: false is not allowed with
// next/dynamic in Server Components. Please move it into a Client Component."
// — node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md, lines 64-66 +
// 94-95, Next 16.2.6). So the dynamic import must live in a 'use client' module.
//
// This wrapper IS that client module. Consumers import it and drop it into the
// shell's `gameSlot`:
//
//   import Game404Dynamic from '@joboostr/notfound/Game404Dynamic'
//   <NotFound404 ... gameSlot={gameOn ? <Game404Dynamic/> : undefined} />
//
// Because the import target (./Game404) is loaded via next/dynamic with
// ssr:false, the engine + its CSS module land in a SEPARATE client chunk that is
// only fetched in the browser — never in the main/shared server bundle, and never
// requested at all when the consumer omits gameSlot (mobile / reduced-motion).
//
// `loading: () => null` keeps the aria-hidden canvas slot empty during the fetch
// window (the slot is pure decoration; nothing user-facing waits on it).

import dynamic from 'next/dynamic'

const Game404Dynamic = dynamic(() => import('./Game404'), {
  ssr: false,
  loading: () => null,
})

export default Game404Dynamic
