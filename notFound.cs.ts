// notFound.cs.ts
// Czech copy module for the shared 404 page. Mirrors the hand-rolled
// lib/copy/cs/*.ts shape used across joboostr (a typed const object, NO inline
// visible strings in the .tsx — project rule G-6). The English sibling is
// notFound.en.ts; consumers pick the module by locale. This is UI copy, so it
// lives with the component, not in a host repo.

export const notFoundCs = {
  /** The error named for screen readers; the numeral itself is decorative. */
  errorTag: 'Chyba 404',
  /** First line of the single page <h1>. */
  h1Top: 'Tuhle stránku',
  /** Second, orange line of the <h1>. */
  h1Accent: 'nevidíme ani my.',
  /** One line under the headline: what most likely happened. */
  body: 'Odkaz je špatně, nebo nabídka mezitím skončila.',
  /** Accessible name of the job search field. */
  searchLabel: 'Hledat pozici',
  /** Placeholder of the job search field (same as the board). */
  searchPlaceholder: 'Hledat pozici…',
  /** Label of the search button (same as the homepage). */
  searchSubmit: 'Hledat práci',
  /** Visible label of the quiet link back home. */
  homeLabel: 'Zpět na úvod',
  /** Accessible label for the logo link (read by screen readers). */
  homeAriaLabel: 'joboostr — zpět na úvodní stránku',
  /** Wordmark text shown next to the brand mark. */
  brandLabel: 'joboostr',
} as const

// Widened to plain strings (the shared Record<Locale, Shape> parity pattern):
// `as const` literal types would reject any second locale's strings. The key
// set still comes from notFoundCs, so shape drift is a compile error in every
// sibling module; notFoundCs itself still satisfies this exactly.
export type NotFoundCopy = { [K in keyof typeof notFoundCs]: string }

export default notFoundCs
