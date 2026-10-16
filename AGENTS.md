# AGENTS.md — @joboostr/notfound

Read this first; `CLAUDE.md` imports it. Exports, usage and version list: `README.md`.

## What this is
The shared branded 404 page for the joboostr apps: a static `NotFound404` shell plus an optional
canvas game. Shipped as raw TypeScript at the repo root (no build step; consumers list
`@joboostr/notfound` in `transpilePackages`).

## Who uses it (pins on 2026-10-16)
joboostr-dashboard `apps/web`, joboostr-web and joboostr-cv-builder all pin `#v0.4.1`. Courses
does not use it. Re-check the apps' `package.json` first.

## Release (only with the founder's go-ahead)
1. In the PR, bump `version` in `package.json` and add the version to the README's
   "Versioning" list.
2. After the founder squash-merges, tag that merge commit `vX.Y.Z` (= the version) and
   push the tag. Tags are immutable: never move, delete or reuse one.
3. Re-pin each app in its own PR (`github:joboostr/joboostr-notfound#vX.Y.Z`). Web and
   cv-builder deploy when that PR merges; the dashboard deploys manually.
No HANDOFF or WORK-LEDGER files here: the PR description is the record.

## Checks (no CI and no test scripts here)
`package.json` has no test or typecheck script. Check a change in a consumer app instead: its
own typecheck and tests, and a look at its 404 page on desktop and phone.

## Careful
- `package.json` `files` is an explicit list: a new file must be added there or it will not
  reach the apps.
- `NotFound404` stays framework-neutral (no `'use client'`, no `next/link`); the game loads
  only through `Game404Dynamic`, so each app's `not-found.tsx` stays a server component.
- React and Next are peers; never bundle them.

## House rules (same in every joboostr repo)
1. Vadim, the founder, is non-technical: use plain English, and explain then wait for a yes
   before anything that creates an account, changes DNS, writes to a remote service, deploys,
   publishes or costs money.
2. Commit and PR titles: `<New|Fix|Speed|Tidy|Docs>: <plain sentence>` (no `feat:` / `fix(x):`).
3. Never `git push`, push a tag or open a PR without asking first.
4. Never commit, print or paste secrets. Local values are 1Password `op://` references used via
   `op run`; Vercel, Cloudflare and Apify keep their own settings. No literal secrets in `.env.local`.
5. Nothing merges to `main` without the founder's go-ahead.
