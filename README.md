# @joboostr/notfound

One branded, brutalist **404 experience** shared by every joboostr site, so it is
built and maintained **once**. Distributed as a **git dependency** (pinned by
tag), not via npm.

```
npm i github:joboostr/joboostr-notfound#v0.2.0
```

## What it ships

| Export | What it is |
| --- | --- |
| `@joboostr/notfound` | `<NotFound404>` — the framework-neutral, always-on static brutalist 404 shell (Czech copy, one `<h1>`, home-link-first, an `aria-hidden` canvas slot). No `'use client'`, no `next/link`, no JS dependency for the 404 fact + home link. |
| `@joboostr/notfound/tokens.css` | The design tokens that travel **inside** the package (so a consumer needn't resolve the private `@joboostr/tokens` workspace package). Import once. |
| `@joboostr/notfound/fonts` | `notFoundFontClass` + the `archivo` / `spaceMono` loaders (self-loaded via `next/font/google` — the package does **not** rely on the host `<html>` for font vars). |
| `@joboostr/notfound/copy` | `notFoundCs` — the Czech copy module (and its `NotFoundCopy` type). |
| `@joboostr/notfound/copy/en` | `notFoundEn` — the English copy module, plus `game404En` (English `Game404Copy` for the game island). Same `NotFoundCopy` shape. |
| `@joboostr/notfound/Game404` | The optional canvas game island (`'use client'` — the "collect job offers" engine). Self-gates: never runs on ≤680px or `prefers-reduced-motion: reduce`. |
| `@joboostr/notfound/Game404Dynamic` | A `'use client'` wrapper that lazy-loads `Game404` via `next/dynamic({ ssr:false })` so the engine lands in a separate client chunk. **This is what a (server-rendered) consumer drops into `gameSlot`** — a raw `next/dynamic({ssr:false})` is not allowed in a Server Component. |

## Minimal usage (a consumer `not-found.tsx`)

```tsx
import { NotFound404 } from '@joboostr/notfound'
import { notFoundCs } from '@joboostr/notfound/copy'
import { notFoundFontClass } from '@joboostr/notfound/fonts'
import '@joboostr/notfound/tokens.css'

export default function NotFound() {
  return (
    <NotFound404
      copy={notFoundCs}
      homeHref="/"
      className={notFoundFontClass}
    />
  )
}
```

### With the optional game (flag-gated)

```tsx
import { NotFound404 } from '@joboostr/notfound'
import { notFoundCs } from '@joboostr/notfound/copy'
import { notFoundFontClass } from '@joboostr/notfound/fonts'
import Game404Dynamic from '@joboostr/notfound/Game404Dynamic'
import '@joboostr/notfound/tokens.css'

export default function NotFound() {
  const gameOn = process.env.NEXT_PUBLIC_NOT_FOUND_GAME === 'true'
  return (
    <NotFound404
      copy={notFoundCs}
      homeHref="/"
      className={notFoundFontClass}
      gameSlot={gameOn ? <Game404Dynamic /> : undefined}
    />
  )
}
```

The game is mounted by passing the (lazy-loaded, `ssr:false`) `Game404Dynamic`
island to `gameSlot`; absent, you get the pure static shell, which is also the
no-JS / mobile / reduced-motion fallback. The engine also self-aborts on
≤680px and `prefers-reduced-motion: reduce`, so it never runs there even if
mounted. The engine ships in its own client chunk (only fetched when it mounts).
Keep your `not-found.tsx` a **server** component — that is why the dynamic import
is wrapped in `Game404Dynamic` (Next forbids `next/dynamic({ssr:false})` in a
Server Component).

## Peer dependencies

`react ^19`, `react-dom ^19`, `next ^16` — peer-depended, never bundled, so the
consumer's single React/Next copy is used.

## Versioning

Consumers pin an exact tag (e.g. `#v0.2.0`). Nothing auto-updates; you upgrade
only by bumping the pinned tag. `v0.1.0` = static shell + a no-op game stub;
`v0.2.0` = the static shell + the real playable canvas game.
