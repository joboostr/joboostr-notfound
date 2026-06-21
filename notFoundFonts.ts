// notFoundFonts.ts
// Self-contained font loading for the shared 404 package.
//
// WHY this lives in the package (not the host): cross-repo recon proved that
// 2.5 of the 4 host sites do NOT expose the design-token font CSS variables on
// their <html>. So <NotFound404> must NOT assume the host provides --font-* —
// it loads its own fonts via Next's next/font/google and applies the generated
// variable classNames on its OWN root element. This corrects the analysis plan's
// "confirm host font var" instruction.
//
// API confirmed against Next.js docs (next/font Font Module, version 16.2.9,
// nextjs.org/docs/app/api-reference/components/font, fetched 2026-06-21):
//   - Multiple fonts: import each loader, call at module scope, combine the
//     `.variable` classNames on one element (the "CSS Variables" pattern).
//   - Two-word font names use an underscore: `Space Mono` -> `Space_Mono`.
//   - Variable fonts (Archivo, wght 100..900) omit `weight`.
//   - Non-variable fonts (Space Mono ships 400 + 700 only) MUST specify weight.
//
// next/font downloads + self-hosts the files at build time (no runtime Google
// request), so this is privacy-safe and adds zero render-blocking network calls.

import { Archivo, Space_Mono } from 'next/font/google'

// Archivo = the product's one typeface. Variable font: omit `weight` to load the
// full 100..900 axis in a single optimized payload. Exposes --font-archivo, which
// notfound-tokens.css maps onto --font-body / --font-display.
export const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
})

// Space Mono = the "typewriter" face used for the brutalist tag / mono labels on
// this page (OQ-3: Archivo + Space Mono). It is a NON-variable font, so weight is
// required; 400 (body mono) + 700 (bold mono labels) cover every weight the CSS
// uses. Exposes --font-space-mono, which notfound-tokens.css maps onto --font-mono.
export const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  display: 'swap',
})

/**
 * The combined className to apply to the package's own root element. It sets BOTH
 * --font-archivo and --font-space-mono so notfound-tokens.css can resolve every
 * --font-* token regardless of what the host <html> provides.
 *
 * Usage in a consumer's not-found.tsx:
 *   import { notFoundFontClass } from '@joboostr/notfound/fonts'
 *   <NotFound404 copy={...} homeHref="/" className={notFoundFontClass} />
 */
export const notFoundFontClass = `${archivo.variable} ${spaceMono.variable}`

export default notFoundFontClass
