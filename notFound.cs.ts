// notFound.cs.ts
// Czech copy module for the shared 404 page. Mirrors the hand-rolled
// lib/copy/cs/*.ts shape used across joboostr (a typed const object, NO inline
// visible strings in the .tsx — project rule G-6). Launch is Czech-only; an
// English stub can be added later as a sibling notFound.en.ts if a second locale
// ships. This is UI copy, so it lives with the component, not in a host repo.
//
// `as const` makes every string a literal type so consumers get exact-shape
// autocomplete and the component can type its `copy` prop against NotFoundCopy.

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

export type NotFoundCopy = typeof notFoundCs

export default notFoundCs
