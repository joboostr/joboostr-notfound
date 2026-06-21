'use client'

// Game404Dynamic.tsx — the consumer-facing dynamic wrapper for the game island.
//
// WHY this exists (Option A, decided in W-2):
// The consumer not-found.tsx files (W-3 apps/web, W-4 outer-3) are SERVER
// components — kept server-rendered for real-404 discipline (a streamed 200 would
// silently lose the noindex header). Next 16's `next/dynamic({ ssr:false })` is
// NOT allowed in a Server Component (it errors: "ssr: false is not allowed with
// next/dynamic in Server Components. Please move it into a Client Component."
// — node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md, Next 16.2.6).
// So the dynamic import must live in a 'use client' module. This wrapper IS that
// client module. Consumers import it and drop it into the shell's `gameSlot`:
//
//   import Game404Dynamic from '@joboostr/notfound/Game404Dynamic'
//   <NotFound404 ... gameSlot={<Game404Dynamic/>} />
//
// CLIENT MOUNT GATE (the load-bearing part):
// `enabled` starts false. We only flip it true inside a mount effect, and only
// when the viewport is desktop (min-width:681px) AND the user has NOT requested
// reduced motion. On the server and on mobile / reduced-motion this component
// renders `null`, so:
//   - NO <canvas> DOM node is ever created, and
//   - the ./Game404 dynamic chunk is NEVER fetched — the `import('./Game404')`
//     only fires when <Game404/> actually renders (>680px, motion allowed).
// This is what finally makes the documented "never ships its chunk on mobile"
// behavior TRUE; before this gate, dynamic() ran unconditionally and both the
// canvas node and the engine chunk loaded everywhere. Game404's own internal
// early-return stays as belt-and-suspenders (it can never run even if mounted
// directly), but THIS gate is what stops the chunk + DOM node up front.

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const Game404 = dynamic(() => import('./Game404'), { ssr: false, loading: () => null })

export default function Game404Dynamic() {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 681px)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (desktop && !reduce) setEnabled(true)
  }, [])
  return enabled ? <Game404 /> : null
}
