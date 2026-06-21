// NotFound404.tsx
// The shared, framework-neutral, ALWAYS-ON static 404 shell for every joboostr
// site. This is plain React — no `'use client'`, no next/link, no apps/web
// imports — so it renders identically in every consumer (Next App Router server
// component, Pages, or any React host) and works with JavaScript disabled. It is
// ALSO the no-JS / mobile / reduced-motion fallback floor: the optional game
// (W-2) only enhances it via the aria-hidden canvas slot below; the 404 fact and
// the home link never depend on JS.
//
// Re-expressed, NOT imported, from apps/web primitives (they pull next/link and
// live inside apps/web, so they are not portable):
//   - brand SVG mark ported from apps/web/components/Brand.tsx:29-35
//     (literal #0c0a09 / #fb6a2d -> token-driven fill="var(--ink)|var(--orange)")
//   - the primary home <a> mirrors apps/web Button (variant="primary") + the
//     proven focus ring from Button.module.css:30-33.
//
// All visible copy comes from the `copy` prop (a Czech copy module) — project
// rule G-6: no literal visible strings in the .tsx.

import type { ReactNode } from 'react'
import type { NotFoundCopy } from './notFound.cs.ts'
import styles from './NotFound404.module.css'

export type NotFound404Props = {
  /** Localized copy (e.g. the Czech notFoundCs module). Required — no defaults. */
  copy: NotFoundCopy
  /** Where the primary "home" link points (usually "/"). */
  homeHref: string
  /**
   * Optional game island, mounted into the aria-hidden canvas slot. Consumers
   * pass the dynamically-imported, flag- + matchMedia-gated <Game404> here (W-2).
   * Absent (the default) = the pure static shell, which is the no-JS floor.
   */
  gameSlot?: ReactNode
  /**
   * Extra classes for the root element — chiefly the next/font variable class
   * from `@joboostr/notfound/fonts` (notFoundFontClass), so the package's own
   * fonts resolve without relying on the host <html>.
   */
  className?: string
}

/** Brand mark ported from apps/web/components/Brand.tsx:29-35, hex tokenized. */
function BrandMark() {
  return (
    <span className={styles.brandTile} aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img">
        {/* hard offset shadow, zero blur (was fill="#0c0a09") */}
        <rect x="43" y="43" width="138" height="138" fill="var(--ink)" />
        {/* orange square with thick ink border (was fill="#fb6a2d" stroke="#0c0a09") */}
        <rect
          x="25"
          y="25"
          width="138"
          height="138"
          fill="var(--orange)"
          stroke="var(--ink)"
          strokeWidth="12"
        />
      </svg>
    </span>
  )
}

export function NotFound404({ copy, homeHref, gameSlot, className }: NotFound404Props) {
  const rootClass = className ? `${styles.root} ${className}` : styles.root

  return (
    <div className={rootClass} data-jb-notfound="">
      <div className={styles.card}>
        {/* DOM ORDER (a11y contract): brand -> one <h1> -> <p> -> home <a>
            (FIRST interactive element) -> aria-hidden canvas slot. */}
        <header className={styles.head}>
          <div className={styles.brand}>
            <BrandMark />
            <span className={styles.brandWordmark}>{copy.brandLabel}</span>
          </div>
          <span className={styles.errorTag}>{copy.errorTag}</span>
        </header>

        <div className={styles.body}>
          <div className={styles.bigNumber} aria-hidden="true">
            404
          </div>
          <h1 className={styles.h1}>{copy.h1}</h1>
          <p className={styles.lead}>{copy.body}</p>

          {/* The home link is the FIRST focusable element — keyboard/SR users
              reach the way out before anything else. Plain <a> (cross-zone house
              pattern), styled like Button variant="primary". */}
          <a href={homeHref} className={styles.homeLink} aria-label={copy.homeAriaLabel}>
            <span>{copy.homeLabel}</span>
            <span className={styles.arrow} aria-hidden="true">
              {'→'}
            </span>
          </a>
        </div>

        {/* Canvas / game slot. aria-hidden + presentational: the game is pure
            decoration; everything that matters is above. Empty by default = the
            static no-JS floor. W-2's dynamically-imported, matchMedia-gated
            <Game404> mounts here via the gameSlot prop. */}
        <div className={styles.canvasSlot} aria-hidden="true">
          {gameSlot}
        </div>
      </div>
    </div>
  )
}

export default NotFound404
