// notFound.en.ts
// English copy module for the shared 404 page — sibling of notFound.cs.ts
// (same shape, hand-authored English).

import type { NotFoundCopy } from './notFound.cs.ts'

export const notFoundEn: NotFoundCopy = {
  errorTag: 'Error 404',
  h1Top: 'Even we can’t',
  h1Accent: 'see this page.',
  body: 'The link is wrong, or the job has closed.',
  searchLabel: 'Search positions',
  searchPlaceholder: 'Search positions…',
  searchSubmit: 'Search jobs',
  homeLabel: 'Back to home',
  homeAriaLabel: 'joboostr — back to the homepage',
  brandLabel: 'joboostr',
}

export default notFoundEn
