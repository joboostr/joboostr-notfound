// notFound.en.ts
// English copy module for the shared 404 page — sibling of notFound.cs.ts
// (same shape, hand-authored English). Also carries the English Game404 copy
// so consumers never hand-roll game strings app-side.

import type { NotFoundCopy } from './notFound.cs.ts'
import type { Game404Copy } from './Game404.tsx'

export const notFoundEn: NotFoundCopy = {
  errorTag: 'Error 404',
  h1: 'This page is ignoring you. Like that job that never got back to you.',
  body: "The page you're looking for isn't here — but thousands of real job openings are, one click away.",
  homeLabel: 'Back to home',
  homeAriaLabel: 'joboostr — back to the homepage',
  brandLabel: 'joboostr',
}

export const game404En: Game404Copy = {
  startTitle: 'CATCH THE JOB OFFERS',
  startSub:
    'Catch job offers to keep your patience up, grab the rare dream jobs for a big bonus, and never catch a rejection. It keeps speeding up — how far you get comes down to skill.',
  startBtn: 'START CATCHING',
  keysMove: 'or move the mouse',
  overTitle: 'YOU RAN OUT OF PATIENCE',
  overSubPrefix: 'The job market does that to everyone. You collected ',
  overSubMid: ' job offers',
  overNewBest: ' — new record!',
  overBest: ' · best ',
  retryBtn: 'RETRY',
  goHome: 'TAKE ME HOME',
  hudScore: 'Offers collected',
  hudBest: 'best · ',
  hudPatience: 'Patience',
  hudStreak: 'Streak',
  fxMissed: 'MISSED',
  fxRejected: 'REJECTED',
  fxDream: 'DREAM +1',
  fxPlus: '+1',
  youTag: 'YOU',
}

export default notFoundEn
