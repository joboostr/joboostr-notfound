// notFound.cs.ts
// Czech copy module for the shared 404 page. Mirrors the hand-rolled
// lib/copy/cs/*.ts shape used across joboostr (a typed const object, NO inline
// visible strings in the .tsx — project rule G-6). The English sibling is
// notFound.en.ts; consumers pick the module by locale. This is UI copy, so it
// lives with the component, not in a host repo.

export const notFoundCs = {
  /** Small brutalist tag above the headline, e.g. an "Chyba 404" badge. */
  errorTag: 'Chyba 404',
  /** The single page <h1>. */
  h1: 'Tahle stránka tě ignoruje. Jako ta práce, co se ti nikdy neozvala.',
  /** Body paragraph under the headline. */
  body: 'Stránku, kterou hledáš, tu nemáme — ale tisíce skutečných nabídek ano, jeden klik odsud.',
  /** Visible label of the primary home link (the first interactive element). */
  homeLabel: 'Zpět na úvod',
  /** Accessible label for the home link / brand mark (read by screen readers). */
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
