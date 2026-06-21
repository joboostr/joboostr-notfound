# @joboostr/notfound

One branded, brutalist **404 experience** shared by every joboostr site, so it is
built and maintained **once**. Distributed as a **git dependency** (pinned by
tag), not via npm.

```
npm i github:joboostr/joboostr-notfound#v0.1.0
```

## What it ships

| Export | What it is |
| --- | --- |
| `@joboostr/notfound` | `<NotFound404>` — the framework-neutral, always-on static brutalist 404 shell (Czech copy, one `<h1>`, home-link-first, an `aria-hidden` canvas slot). No `'use client'`, no `next/link`, no JS dependency for the 404 fact + home link. |
| `@joboostr/notfound/tokens.css` | The design tokens that travel **inside** the package (so a consumer needn't resolve the private `@joboostr/tokens` workspace package). Import once. |
| `@joboostr/notfound/fonts` | `notFoundFontClass` + the `archivo` / `spaceMono` loaders (self-loaded via `next/font/google` — the package does **not** rely on the host `<html>` for font vars). |
| `@joboostr/notfound/copy` | `notFoundCs` — the Czech copy module (and its `NotFoundCopy` type). |
| `@joboostr/notfound/Game404` | The optional canvas game island (**W-2** — currently a no-op stub). |

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

The optional game is mounted by passing a (dynamically-imported, flag- +
`matchMedia`-gated) island to `gameSlot`; absent, you get the pure static shell,
which is also the no-JS / mobile / reduced-motion fallback.

## Peer dependencies

`react ^19`, `react-dom ^19`, `next ^16` — peer-depended, never bundled, so the
consumer's single React/Next copy is used.

## Versioning

Consumers pin an exact tag (`#v0.1.0`). Nothing auto-updates; you upgrade only by
bumping the pinned tag.
