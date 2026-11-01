// notFoundFonts.ts
// Self-contained font loading for the shared 404 page.
//
// WHY this lives in the package (not the host): root 404 boundaries own their
// own <html>, so they sit outside each host's locale layout and its font setup.
// A host with no font of its own on that path applies this class on the
// <NotFound404> root. next/font downloads and self-hosts the file at build time,
// so there is no runtime Google request.

import { Inter } from 'next/font/google'

// Inter = the product's one typeface. Variable font: omit `weight` to load the
// full 100..900 axis in a single optimized payload. Exposes --font-inter, which
// notfound-tokens.css maps onto --font-body / --font-display.
export const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
})

/**
 * The className to apply to the package's own root element.
 *
 * Usage in a consumer's root not-found.tsx:
 *   import { notFoundFontClass } from '@joboostr/notfound/fonts'
 *   <NotFound404 copy={...} homeHref="/" jobsHref="/cs/jobs" className={notFoundFontClass} />
 */
export const notFoundFontClass = inter.variable

export default notFoundFontClass
