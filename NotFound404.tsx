// NotFound404.tsx
// The shared, framework-neutral, ALWAYS-ON static 404 shell for every joboostr
// site. This is plain React — no `'use client'`, no next/link, no apps/web
// imports — so it renders identically in every consumer (Next App Router server
// component, Pages, or any React host) and works with JavaScript disabled. It is
// a client-free floor: the 404 fact, the job search and the home link never
// depend on JS.
//
// The search is a plain GET form: `?role=` is the board's own query parameter
// (joboostr-web components/home/HeroSearch.tsx jobsUrl), so a visitor who lost a
// job link reaches matching jobs without any client code.
//
// All visible copy comes from the `copy` prop (a Czech copy module) — project
// rule G-6: no literal visible strings in the .tsx.

import type { NotFoundCopy } from './notFound.cs.ts'
import styles from './NotFound404.module.css'

export type NotFound404Props = {
  /** Localized copy (e.g. the Czech notFoundCs module). Required — no defaults. */
  copy: NotFoundCopy
  /** Where the home link points (usually "/"). */
  homeHref: string
  /** The localized job board the search submits to (e.g. "/cs/jobs"). */
  jobsHref: string
  /**
   * Show the logo above the page. Hosts that already render the shared side
   * navigation on this boundary pass false so the logo is not shown twice.
   */
  showBrand?: boolean
  /**
   * Extra classes for the root element — chiefly the next/font variable class
   * from `@joboostr/notfound/fonts` (notFoundFontClass), so the package's own
   * fonts resolve without relying on the host <html>.
   */
  className?: string
}

/** Inter ExtraBold "404" outlined with overlaps merged, so the ghost stroke has no inner lines. */
const NUMERAL_PATH =
  'M1604 1447Q1744 1538 1941 1538Q2139 1538 2279 1447Q2419 1356 2493 1186Q2567 1015 2567 774Q2567 533 2493 362Q2419 191 2278 100Q2138 8 1941 8Q1744 8 1604 99Q1465 190 1390 362Q1315 533 1315 774Q1315 1015 1390 1186Q1465 1356 1604 1447ZM726 1269V1518H1065V1269H1244V990H1065V28H620L8 993V1269H726ZM3369 1269V1518H3708V1269H3887V990H3708V28H3263L2651 993V1269H3369ZM2084 1194Q2026 1249 1941 1249Q1857 1249 1798 1194Q1739 1139 1709 1033Q1679 927 1679 774Q1679 620 1709 514Q1740 407 1798 351Q1857 295 1942 295Q2026 295 2084 351Q2143 407 2173 514Q2204 620 2204 774Q2204 927 2173 1033Q2143 1139 2084 1194ZM734 990H359V978L722 404H734V990ZM3377 990H3002V978L3365 404H3377V990Z'

/** The numeral's canvas: the digits plus the brand's square full stop. */
const NUMERAL_VIEW_BOX = '0 0 4330 1546'

/** Brand mark from joboostr-nav src/assets/joboostr-mark.svg, hex tokenized. */
function BrandMark() {
  return (
    <span className={styles.brandTile} aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <rect width="64" height="64" fill="var(--orange)" />
        <g transform="translate(3.2 3.2) scale(0.9)" fill="#fff">
          <path d="M37 14v23c0 9-5 13-12 13S13 45 13 38h9c0 3 1 5 4 5s3-2 3-6V14Z" />
          <path d="M43 41h9v9h-9Z" />
        </g>
      </svg>
    </span>
  )
}

/**
 * The page's one moment: the solid digits wipe away and leave their outline with
 * the brand's square full stop, the same mark that ends the logo and the wordmark.
 * Decorative (the accessible error text sits beside the heading).
 */
function Numeral() {
  return (
    <div className={styles.numeral} aria-hidden="true">
      <svg className={styles.numeralGhost} xmlns="http://www.w3.org/2000/svg" viewBox={NUMERAL_VIEW_BOX}>
        <path d={NUMERAL_PATH} />
        <rect className={styles.numeralStop} x="3990" y="1188" width="330" height="330" />
      </svg>
      <svg className={styles.numeralInk} xmlns="http://www.w3.org/2000/svg" viewBox={NUMERAL_VIEW_BOX}>
        <path d={NUMERAL_PATH} />
      </svg>
    </div>
  )
}

export function NotFound404({
  copy,
  homeHref,
  jobsHref,
  showBrand = true,
  className,
}: NotFound404Props) {
  const rootClass = className ? `${styles.root} ${className}` : styles.root

  return (
    <div className={rootClass} data-jb-notfound="">
      {/* DOM ORDER (a11y contract): the way home -> one <h1> -> <p> -> search
          -> home link. */}
      {showBrand ? (
        <a href={homeHref} className={styles.brand} aria-label={copy.homeAriaLabel}>
          <BrandMark />
          <span className={styles.brandWordmark}>{copy.brandLabel}</span>
        </a>
      ) : null}

      <div className={styles.stage}>
        <Numeral />

        <p className={styles.srOnly}>{copy.errorTag}</p>
        <h1 className={styles.h1}>
          {copy.h1Top} <span className={styles.h1Accent}>{copy.h1Accent}</span>
        </h1>
        <p className={styles.lead}>{copy.body}</p>

        <form className={styles.search} action={jobsHref} method="get" role="search">
          <svg
            className={styles.searchIcon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.8-3.8" />
          </svg>
          <input
            className={styles.searchInput}
            type="search"
            name="role"
            aria-label={copy.searchLabel}
            placeholder={copy.searchPlaceholder}
            enterKeyHint="search"
            autoComplete="off"
          />
          <button type="submit" className={styles.searchSubmit}>
            <span className={styles.searchSubmitLabel}>{copy.searchSubmit}</span>
            <svg
              className={styles.searchSubmitIcon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>

        <a href={homeHref} className={styles.homeLink}>
          {copy.homeLabel}
        </a>
      </div>
    </div>
  )
}

export default NotFound404
