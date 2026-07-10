'use client'

// Game404.tsx — the optional, flag-gated canvas game island (W-2).
//
// This is the interactive "collect the job offers" engine, ported from the
// prototype at joboostr-dashboard/prototypes/404-game.html (the IIFE at lines
// ~285-469). It mounts into <NotFound404>'s aria-hidden canvas slot via the
// `gameSlot` prop. It is PURE DECORATION: the 404 fact + the home link live in
// the always-on static shell and never depend on this island.
//
// React-correctness vs. the prototype (the prototype is a single long-lived
// <script>; a React island can mount/unmount/StrictMode-double-mount):
//   - The ENTIRE engine lives inside ONE mount useEffect (empty deps), scoped to
//     a canvasRef — no document.getElementById, no module-level mutable state.
//   - The rAF id is stored in a ref and cancelled in cleanup (prototype BUG:
//     never captured an id at 457/468 -> a leaked loop after unmount).
//   - visibilitychange/blur PAUSE the loop by cancelling the frame; focus/visible
//     reschedule (prototype BUG at 452-458: it busy-spun rAF while hidden).
//   - EVERY addEventListener has a matching removeEventListener in cleanup
//     (prototype BUG: 348-352/466 listeners were never removed).
//   - best-score is read from localStorage INSIDE the effect (never a useState
//     initializer — that would run on the server / mismatch on hydrate).
//   - DPR is capped at Math.min(devicePixelRatio, 2) (prototype already did this).
//   - The canvas palette is sourced ONCE at mount via getComputedStyle off the
//     [data-jb-notfound] root (canvas fillStyle cannot take var(--x)); zero hex
//     literals survive except the sanctioned white (#fff). Canvas font faces are
//     the package's Space Mono / Archivo token faces, not the prototype's three
//     Google fonts.
//   - BELT-AND-SUSPENDERS GATE: the effect returns early (before scheduling a
//     single rAF) when the viewport is <=680px OR prefers-reduced-motion:reduce.
//     The consumer ALSO gates the mount (matchMedia + flag) via Game404Dynamic,
//     so on mobile / reduced-motion this island never even ships its chunk.

import { useEffect, useRef } from 'react'
import styles from './NotFoundGame.module.css'

// All in-engine localized flavor text is UI copy (canvas-drawn text + overlay
// labels, not the shell copy module). It arrives via the optional `copy` prop;
// the Czech object below is the default so existing consumers are unchanged.
// The English sibling (game404En) lives in notFound.en.ts next to the shell copy.
export interface Game404Copy {
  startTitle: string
  startSub: string
  startBtn: string
  keysMove: string
  overTitle: string
  overSubPrefix: string
  overSubMid: string
  overNewBest: string
  overBest: string
  retryBtn: string
  goHome: string
  hudScore: string
  hudBest: string
  hudPatience: string
  hudStreak: string
  // canvas-drawn floaters
  fxMissed: string
  fxRejected: string
  fxDream: string
  fxPlus: string
  youTag: string
}

export const game404Cs: Game404Copy = {
  startTitle: 'SBÍREJ NABÍDKY PRÁCE',
  startSub:
    'Chytej nabídky práce, ať ti neklesne trpělivost, lov vzácné vysněné práce za velký bonus a nikdy nechytej odmítnutí. Zrychluje se to — jak daleko dojdeš, rozhodne tvá zručnost.',
  startBtn: 'ZAČÍT SBÍRAT',
  keysMove: 'nebo pohni myší',
  overTitle: 'DOŠLA TI TRPĚLIVOST',
  overSubPrefix: 'Trh práce to udělá každému. Nasbíral jsi ',
  overSubMid: ' nabídek práce',
  overNewBest: ' — nový rekord!',
  overBest: ' · rekord ',
  retryBtn: 'ZNOVU',
  goHome: 'VZÍT MĚ DOMŮ',
  hudScore: 'Nasbírané nabídky',
  hudBest: 'rekord · ',
  hudPatience: 'Trpělivost',
  hudStreak: 'Série',
  fxMissed: 'MINUL',
  fxRejected: 'ODMÍTNUTO',
  fxDream: 'SEN +1',
  fxPlus: '+1',
  youTag: 'TY',
}

type Kind = 'job' | 'dream' | 'spam'

type Palette = {
  bg: string
  ink: string
  inkSoft: string
  orange: string
  orangeDark: string
  good: string
  bad: string
  gold: string
  white: string
  fontMono: string
  fontDisplay: string
}

export default function Game404({ copy = game404Cs }: { copy?: Game404Copy } = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    // ---- BELT-AND-SUSPENDERS GATE (Step 7) ----------------------------------
    // Return BEFORE scheduling a single rAF if this is a touch/narrow viewport
    // or the user asked for reduced motion. (The consumer's Game404Dynamic also
    // gates the mount, so normally this island never ships on mobile; this is the
    // second belt so the engine can never run even if mounted directly.)
    if (typeof window === 'undefined') return
    const desktop = window.matchMedia('(min-width: 681px)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!desktop || reduceMotion) return

    const canvas = canvasRef.current
    const overlayHost = overlayRef.current
    if (!canvas || !overlayHost) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const stage = canvas.parentElement
    if (!stage) return

    // ---- FROZEN TOKEN PALETTE via getComputedStyle (Step 6) -----------------
    // Read tokens ONCE off the [data-jb-notfound] root (where the package's
    // font + token vars resolve — see notfound-tokens.css scoping note). Canvas
    // fillStyle can't take var(--x), so we snapshot resolved values.
    const root: Element = canvas.closest('[data-jb-notfound]') ?? document.documentElement
    const cs = getComputedStyle(root)
    const tok = (name: string, fallback: string) => {
      const v = cs.getPropertyValue(name).trim()
      return v || fallback
    }
    const palette: Palette = Object.freeze({
      bg: tok('--bg', 'rgb(252,251,248)'),
      ink: tok('--ink', 'rgb(12,10,9)'),
      inkSoft: tok('--ink-soft', 'rgb(86,84,79)'),
      orange: tok('--orange', 'rgb(251,106,45)'),
      orangeDark: tok('--orange-dark', 'rgb(232,92,32)'),
      good: tok('--good', 'rgb(52,211,153)'),
      bad: tok('--bad', 'rgb(236,74,60)'),
      gold: tok('--gold', 'rgb(255,210,63)'),
      white: '#fff', // sanctioned white-on-orange brand exception
      // Canvas font faces: the package token faces (Space Mono / Archivo), NOT
      // the prototype's JetBrains Mono / Bricolage Grotesque.
      fontMono: tok('--font-mono', "'Space Mono', ui-monospace, monospace"),
      fontDisplay: tok('--font-display', "'Archivo', system-ui, sans-serif"),
    })

    // ---- engine state (local to this mount) ---------------------------------
    let W = 700
    let H = 420

    let best = 0
    try {
      best = +(window.localStorage.getItem('jb404_best') || 0) || 0
    } catch {
      best = 0
    }

    let state: 'start' | 'playing' | 'over' = 'start'
    let score = 0
    let patience = 100
    let combo = 1
    let comboTimer = 0

    type Item = {
      kind: Kind
      color: string
      x: number
      y: number
      w: number
      h: number
      vy: number
      rot: number
      vr: number
    }
    type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string; s: number }
    type Floater = { x: number; y: number; txt: string; color: string; life: number; vy: number }

    let items: Item[] = []
    let particles: Particle[] = []
    let floaters: Floater[] = []
    let spawnT = 0
    let elapsed = 0
    let last = 0

    const player = { x: W / 2, w: 96, h: 52, target: W / 2 }
    const keys = { left: false, right: false }

    // ---- DOM refs to the React-rendered HUD/overlay nodes -------------------
    const $ = <T extends HTMLElement>(sel: string): T | null => overlayHost.querySelector<T>(sel)
    const scoreVal = $('[data-score]')
    const bestVal = $('[data-best]')
    const patienceVal = $('[data-patience]')
    const patienceBar = $<HTMLElement>('[data-patience-bar]')
    const comboVal = $('[data-combo]')
    const danger = $<HTMLElement>('[data-danger]')
    const startOverlay = $<HTMLElement>('[data-overlay="start"]')
    const overOverlay = $<HTMLElement>('[data-overlay="over"]')
    const overScore = $('[data-over-score]')
    const overBest = $('[data-over-best]')

    function fit() {
      const r = stage!.getBoundingClientRect()
      if (r.width < 10 || r.height < 10) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2) // DPR cap
      W = r.width
      H = r.height
      canvas!.width = Math.round(W * dpr)
      canvas!.height = Math.round(H * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      player.w = Math.max(64, Math.min(108, W * 0.13))
      player.x = Math.max(player.w / 2, Math.min(W - player.w / 2, player.x))
      player.target = Math.max(player.w / 2, Math.min(W - player.w / 2, player.target))
    }

    function reset() {
      score = 0
      patience = 100
      combo = 1
      comboTimer = 0
      items = []
      particles = []
      floaters = []
      spawnT = 0
      elapsed = 0
      player.x = W / 2
      player.target = W / 2
      updateHud()
    }

    function pickKind(): { type: Kind; color: string } {
      const spam = 22 + Math.min(22, elapsed * 0.3)
      const dream = 9
      const job = Math.max(36, 100 - spam - dream)
      let r = Math.random() * (job + dream + spam)
      if ((r -= job) < 0) return { type: 'job', color: palette.orange }
      if ((r -= dream) < 0) return { type: 'dream', color: palette.gold }
      return { type: 'spam', color: palette.bad }
    }

    function spawn() {
      const k = pickKind()
      const w = k.type === 'dream' ? 50 : 44
      const h = k.type === 'spam' ? 48 : 56
      const speed = 120 + elapsed * 6 + Math.random() * 70
      items.push({
        kind: k.type,
        color: k.color,
        x: 24 + Math.random() * (W - 48 - w),
        y: -h,
        w,
        h,
        vy: speed,
        rot: (Math.random() - 0.5) * 0.5,
        vr: (Math.random() - 0.5) * 2,
      })
    }

    function setTargetFromClient(cx: number) {
      const r = canvas!.getBoundingClientRect()
      player.target = (cx - r.left) * (W / r.width)
    }

    function burst(x: number, y: number, c: string, n: number) {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2
        const sp = 40 + Math.random() * 160
        particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 40, life: 0.6 + Math.random() * 0.4, color: c, s: 3 + Math.random() * 4 })
      }
    }
    function floatText(x: number, y: number, txt: string, c: string) {
      floaters.push({ x, y, txt, color: c, life: 0.9, vy: -46 })
    }
    function shakeCard() {
      const card = canvas!.closest('[data-jb-game-card]') as HTMLElement | null
      if (!card) return
      card.classList.remove(styles.shake)
      void card.offsetWidth
      card.classList.add(styles.shake)
    }

    function onCatch(it: Item) {
      if (it.kind === 'spam') {
        patience = Math.max(0, patience - 25)
        combo = 1
        comboTimer = 0
        burst(it.x + it.w / 2, it.y + it.h / 2, palette.bad, 14)
        floatText(it.x + it.w / 2, it.y, copy.fxRejected, palette.bad)
        shakeCard()
      } else {
        const dream = it.kind === 'dream'
        combo = Math.min(9, combo + 1)
        comboTimer = 2.4
        score += 1
        patience = Math.min(100, patience + (dream ? 12 : 1.5))
        burst(it.x + it.w / 2, it.y + it.h / 2, it.color, dream ? 22 : 12)
        floatText(it.x + it.w / 2, it.y, dream ? copy.fxDream : copy.fxPlus, dream ? palette.orangeDark : palette.ink)
      }
    }

    function update(dt: number) {
      elapsed += dt
      const kb = 520 * dt
      if (keys.left) player.target -= kb
      if (keys.right) player.target += kb
      player.target = Math.max(player.w / 2, Math.min(W - player.w / 2, player.target))
      player.x += (player.target - player.x) * Math.min(1, dt * 14)

      spawnT -= dt
      const interval = Math.max(0.36, 0.95 - elapsed * 0.012)
      if (spawnT <= 0) {
        spawn()
        spawnT = interval
      }
      if (comboTimer > 0) {
        comboTimer -= dt
        if (comboTimer <= 0) combo = 1
      }

      const catchY = H - player.h - 12
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i]
        it.y += it.vy * dt
        it.rot += it.vr * dt
        const cx = it.x + it.w / 2
        const within = cx > player.x - player.w / 2 - 6 && cx < player.x + player.w / 2 + 6
        if (it.y + it.h >= catchY && it.y + it.h <= catchY + it.h + 6 && within) {
          onCatch(it)
          items.splice(i, 1)
          continue
        }
        if (it.y > H + 40) {
          if (it.kind !== 'spam') {
            patience = Math.max(0, patience - 6)
            combo = 1
            comboTimer = 0
            floatText(it.x + it.w / 2, H - 26, copy.fxMissed, palette.inkSoft)
          }
          items.splice(i, 1)
        }
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life -= dt
        p.vy += 420 * dt
        p.x += p.vx * dt
        p.y += p.vy * dt
        if (p.life <= 0) particles.splice(i, 1)
      }
      for (let i = floaters.length - 1; i >= 0; i--) {
        const f = floaters[i]
        f.life -= dt
        f.y += f.vy * dt
        if (f.life <= 0) floaters.splice(i, 1)
      }

      if (patience <= 0) {
        patience = 0
        state = 'over'
        const isNewBest = score > best
        if (isNewBest) {
          best = score
          try {
            window.localStorage.setItem('jb404_best', String(best))
          } catch {
            /* private mode / quota — non-fatal */
          }
        }
        if (overScore) overScore.textContent = String(score)
        if (overBest) overBest.textContent = isNewBest ? copy.overNewBest : best > 0 ? copy.overBest + best : ''
        show('over')
      }
      updateHud()
    }

    function updateHud() {
      if (scoreVal) scoreVal.textContent = String(score)
      if (bestVal) bestVal.textContent = copy.hudBest + Math.max(best, score)
      if (patienceVal) patienceVal.textContent = Math.round(patience) + '%'
      if (patienceBar) {
        patienceBar.style.width = patience + '%'
        patienceBar.style.background = patience < 30 ? palette.bad : patience < 60 ? palette.gold : palette.good
      }
      if (comboVal) comboVal.textContent = '×' + combo
      if (danger) {
        const d = patience < 40 ? (40 - patience) / 40 : 0
        // The red vignette uses an explicit rgba so it can fade alpha; the RGB
        // channel comes from the resolved --bad token, parsed to channels.
        danger.style.boxShadow = `inset 0 0 ${40 + d * 40}px ${6 + d * 18}px ${rgbaFrom(palette.bad, d * 0.55)}`
      }
    }

    // Parse a resolved color token into an rgba() with the given alpha. Handles
    // rgb()/rgba()/#hex; falls back to a neutral if unparseable.
    function rgbaFrom(color: string, alpha: number): string {
      let r = 236
      let g = 74
      let b = 60
      const m = color.match(/rgba?\(([^)]+)\)/)
      if (m) {
        const parts = m[1].split(',').map((s) => parseFloat(s))
        ;[r, g, b] = parts
      } else if (color[0] === '#') {
        const hex = color.slice(1)
        const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex
        r = parseInt(full.slice(0, 2), 16)
        g = parseInt(full.slice(2, 4), 16)
        b = parseInt(full.slice(4, 6), 16)
      }
      return `rgba(${r},${g},${b},${alpha.toFixed(2)})`
    }

    function drawItem(it: Item) {
      ctx!.save()
      ctx!.translate(it.x + it.w / 2, it.y + it.h / 2)
      ctx!.rotate(it.rot)
      const w = it.w
      const h = it.h
      const x = -w / 2
      const y = -h / 2
      ctx!.fillStyle = palette.ink
      ctx!.fillRect(x + 4, y + 4, w, h)
      ctx!.fillStyle = it.kind === 'spam' ? palette.bad : it.kind === 'dream' ? palette.gold : palette.white
      ctx!.fillRect(x, y, w, h)
      ctx!.lineWidth = 3
      ctx!.strokeStyle = palette.ink
      ctx!.strokeRect(x, y, w, h)
      if (it.kind === 'job') {
        ctx!.fillStyle = palette.orange
        ctx!.fillRect(x, y, w, 12)
        ctx!.fillStyle = palette.ink
        ctx!.fillRect(x + 7, y + 22, w - 22, 4)
        ctx!.fillRect(x + 7, y + 32, w - 30, 4)
        ctx!.fillRect(x + 7, y + 42, w - 16, 4)
      } else if (it.kind === 'dream') {
        ctx!.fillStyle = palette.ink
        ctx!.font = `700 22px ${palette.fontMono}`
        ctx!.textAlign = 'center'
        ctx!.textBaseline = 'middle'
        ctx!.fillText('★', 0, 1)
      } else {
        ctx!.strokeStyle = palette.white
        ctx!.lineWidth = 4
        ctx!.beginPath()
        ctx!.moveTo(x + 10, y + 11)
        ctx!.lineTo(x + w - 10, y + h - 11)
        ctx!.moveTo(x + w - 10, y + 11)
        ctx!.lineTo(x + 10, y + h - 11)
        ctx!.stroke()
      }
      ctx!.restore()
    }

    function drawPlayer() {
      const w = player.w
      const h = player.h
      const x = player.x - w / 2
      const y = H - h - 8
      ctx!.fillStyle = palette.ink
      ctx!.fillRect(x + 5, y + 5, w, h)
      ctx!.fillStyle = palette.orange
      ctx!.fillRect(x, y, w, h)
      ctx!.lineWidth = 4
      ctx!.strokeStyle = palette.ink
      ctx!.strokeRect(x, y, w, h)
      ctx!.lineWidth = 5
      ctx!.beginPath()
      ctx!.moveTo(x + w / 2 - 15, y)
      ctx!.lineTo(x + w / 2 - 15, y - 11)
      ctx!.lineTo(x + w / 2 + 15, y - 11)
      ctx!.lineTo(x + w / 2 + 15, y)
      ctx!.stroke()
      ctx!.fillStyle = palette.ink
      ctx!.fillRect(x + w / 2 - 10, y + h / 2 - 6, 20, 12)
      ctx!.fillStyle = palette.orange
      ctx!.fillRect(x + w / 2 - 5, y + h / 2 - 3, 10, 6)
      ctx!.fillStyle = palette.ink
      ctx!.font = `700 11px ${palette.fontMono}`
      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'middle'
      ctx!.fillText(copy.youTag, x + w / 2, y + h - 11)
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H)
      // dashed catch line — derive a faint ink from the resolved token
      ctx!.strokeStyle = rgbaFrom(palette.ink, 0.12)
      ctx!.lineWidth = 2
      ctx!.setLineDash([8, 8])
      const ly = H - player.h - 12
      ctx!.beginPath()
      ctx!.moveTo(0, ly)
      ctx!.lineTo(W, ly)
      ctx!.stroke()
      ctx!.setLineDash([])
      items.forEach(drawItem)
      if (state === 'playing') drawPlayer()
      particles.forEach((p) => {
        ctx!.globalAlpha = Math.max(0, p.life)
        ctx!.fillStyle = p.color
        ctx!.fillRect(p.x, p.y, p.s, p.s)
      })
      ctx!.globalAlpha = 1
      floaters.forEach((f) => {
        ctx!.globalAlpha = Math.max(0, f.life)
        ctx!.fillStyle = f.color
        ctx!.font = `800 20px ${palette.fontDisplay}`
        ctx!.textAlign = 'center'
        ctx!.fillText(f.txt, f.x, f.y)
      })
      ctx!.globalAlpha = 1
    }

    // ---- the loop: id captured to rafRef on EVERY schedule (Step 3) ---------
    function frame(ts: number) {
      if (!last) last = ts
      let dt = (ts - last) / 1000
      last = ts
      dt = Math.min(dt, 0.05) // dt clamp — no catch-up jump after a pause
      if (state === 'playing') update(dt)
      draw()
      rafRef.current = window.requestAnimationFrame(frame)
    }

    function startLoop() {
      if (rafRef.current != null) return // already running
      last = 0
      rafRef.current = window.requestAnimationFrame(frame)
    }
    function stopLoop() {
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }

    function show(which: 'start' | 'over' | null) {
      if (startOverlay) startOverlay.hidden = which !== 'start'
      if (overOverlay) overOverlay.hidden = which !== 'over'
    }

    // ---- named handlers (so cleanup can remove EXACTLY them) (Step 4 + 5) ---
    const onMouseMove = (e: MouseEvent) => {
      if (state === 'playing') setTargetFromClient(e.clientX)
    }
    const onTouchMove = (e: TouchEvent) => {
      if (state === 'playing' && e.touches[0]) {
        setTargetFromClient(e.touches[0].clientX)
        e.preventDefault()
      }
    }
    const onTouchStart = (e: TouchEvent) => {
      if (state === 'playing' && e.touches[0]) {
        setTargetFromClient(e.touches[0].clientX)
        e.preventDefault()
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) keys.left = true
      if (['ArrowRight', 'd', 'D'].includes(e.key)) keys.right = true
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) keys.left = false
      if (['ArrowRight', 'd', 'D'].includes(e.key)) keys.right = false
    }
    const onResize = () => fit()
    // Pause/resume (replaces the prototype's hidden-busy-spin at 452-458).
    const onVisibility = () => {
      if (document.hidden) {
        stopLoop()
      } else {
        last = 0
        startLoop()
      }
    }
    const onBlur = () => stopLoop()
    const onFocus = () => {
      last = 0
      startLoop()
    }

    const onStartClick = () => {
      reset()
      state = 'playing'
      show(null)
    }
    const onRetryClick = () => {
      reset()
      state = 'playing'
      show(null)
    }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)

    const startBtn = $<HTMLButtonElement>('[data-start-btn]')
    const retryBtn = $<HTMLButtonElement>('[data-retry-btn]')
    startBtn?.addEventListener('click', onStartClick)
    retryBtn?.addEventListener('click', onRetryClick)

    // initial sizing + first frame (wait a frame so layout settles); the boot id
    // ALSO goes through rafRef so cleanup cancels it even before the loop starts.
    rafRef.current = window.requestAnimationFrame(() => {
      // The boot frame has now fired, so its id is stale — clear it BEFORE
      // startLoop(), otherwise startLoop()'s "already running?" guard
      // (rafRef.current != null) would early-return and the loop would never
      // actually begin (it would only ever start on a later visibility/focus
      // resume). Clearing here lets startLoop() schedule the real loop.
      rafRef.current = null
      fit()
      reset()
      show('start')
      // Start the loop now: it draws the idle/animated canvas while the start
      // overlay sits above it; gameplay (update) only runs once state==='playing'.
      startLoop()
    })

    // ---- cleanup: cancel rAF + remove EVERY listener (Step 3/4/5) -----------
    return () => {
      stopLoop()
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
      startBtn?.removeEventListener('click', onStartClick)
      retryBtn?.removeEventListener('click', onRetryClick)
    }
  }, [])

  // The HUD + overlays are React-rendered (so they exist when the effect queries
  // them); the canvas is the engine surface. data-jb-game-card lets the engine
  // find the card root for the .shake feedback.
  return (
    <div className={styles.gameCard} data-jb-game-card>
      <div className={styles.hud} ref={overlayRef}>
        <div className={styles.hudXp}>
          <div className={styles.hudLabel}>{copy.hudScore}</div>
          <div className={styles.hudVal} data-score>
            0
          </div>
          <div className={styles.hudBest} data-best>
            {copy.hudBest}0
          </div>
        </div>
        <div className={styles.hudCell}>
          <div className={styles.hudLabel}>{copy.hudPatience}</div>
          <div className={styles.hudVal} data-patience>
            100%
          </div>
          <div className={styles.bar}>
            <span data-patience-bar />
          </div>
        </div>
        <div className={styles.hudCellNarrow}>
          <div className={styles.hudLabel}>{copy.hudStreak}</div>
          <div className={styles.hudVal} data-combo>
            ×1
          </div>
        </div>

        <div className={styles.stage}>
          <canvas ref={canvasRef} className={styles.canvas} />
          <div className={styles.danger} data-danger />

          <div className={styles.overlay} data-overlay="start">
            <div className={styles.oTitle}>{copy.startTitle}</div>
            <p className={styles.oSub}>{copy.startSub}</p>
            <div className={styles.keys}>
              <span>
                <kbd>◀</kbd> <kbd>▶</kbd>
              </span>
              <span>
                <kbd>A</kbd> <kbd>D</kbd>
              </span>
              <span>{copy.keysMove}</span>
            </div>
            <button type="button" className={styles.btn} data-start-btn>
              {copy.startBtn} <span className={styles.arrow}>→</span>
            </button>
          </div>

          <div className={styles.overlay} data-overlay="over" hidden>
            <div className={styles.oTitle}>{copy.overTitle}</div>
            <p className={styles.oSub}>
              {copy.overSubPrefix}
              <b data-over-score>0</b>
              {copy.overSubMid}
              <b className={styles.overBest} data-over-best />
            </p>
            <div className={styles.overActions}>
              <button type="button" className={styles.btn} data-retry-btn>
                {copy.retryBtn} <span className={styles.arrow}>↻</span>
              </button>
              <a className={`${styles.btn} ${styles.btnGhost}`} href="/">
                {copy.goHome}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
