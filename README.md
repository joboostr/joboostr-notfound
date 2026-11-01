# @joboostr/notfound

One branded **404 page** shared by every joboostr site, so it is built and
maintained **once**. Distributed as a **git dependency** (pinned by tag), not via
npm.

```
npm i github:joboostr/joboostr-notfound#v0.5.0
```

## What it ships

| Export | What it is |
| --- | --- |
| `@joboostr/notfound` | `<NotFound404>` — the framework-neutral static 404 page: one `<h1>`, a job search that is a plain GET form, and a link home. No `'use client'`, no `next/link`, no JS dependency. |
| `@joboostr/notfound/tokens.css` | The page's token import, plus its font-role mapping. Import once. |
| `@joboostr/notfound/fonts` | `notFoundFontClass` and the `inter` loader, for boundaries with no host font. |
| `@joboostr/notfound/copy` | `notFoundCs` — the Czech copy module (and its `NotFoundCopy` type). |
| `@joboostr/notfound/copy/en` | `notFoundEn` — the English copy module. Same `NotFoundCopy` shape. |

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
      jobsHref="/cs/jobs"
      className={notFoundFontClass}
    />
  )
}
```

`jobsHref` is the localized job board; the search submits `?role=` there. Pass
`showBrand={false}` on a boundary that already shows the shared side navigation,
so the logo does not appear twice.

## Peer dependencies

`react ^19`, `react-dom ^19`, `next ^16` and `@joboostr/tokens` — peer-depended,
never bundled, so the consumer's single copies are used. The page needs a tokens
version that exports `redesign.css` (`v3.1.0` or newer).

## Versioning

Consumers pin an exact tag (e.g. `#v0.5.0`). Nothing auto-updates; you upgrade
only by bumping the pinned tag. `v0.1.0` = static shell + a no-op game stub;
`v0.2.0` = the static shell + the real playable canvas game; `v0.3.0` =
localized copy and shared integration updates; `v0.4.0` = Inter replaces
Archivo in the self-contained font loader; `v0.4.1` = `notFoundMonoFontClass`
for localized hosts that already load Inter; `v0.5.0` = the page is redesigned
for the 2026 application look, gains the job search, and loses the game, its
copy and the Space Mono font (`jobsHref` is now required; `gameSlot`,
`Game404`, `Game404Dynamic`, `game404En` and `notFoundMonoFontClass` are removed).
