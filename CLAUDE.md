# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev     # dev server on http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
npm run lint    # bare `eslint` — flat config, no path argument; lints per eslint.config.mjs
```

There is no test runner configured — no test script and no testing dependency. If tests are
needed, pick and install a runner first; don't assume one exists.

## Next.js 16 conventions used here

`AGENTS.md` (imported above) is the authority: read the version-pinned docs in
`node_modules/next/dist/docs/` (`01-app/`, `02-pages/`, `03-architecture/`) before writing code.
Specifics already in play in this repo:

- **Generated route types are global.** `app/layout.tsx` types its props as `LayoutProps<"/">`
  with no import. These types come from `.next/types/` (`routes.d.ts`, `root-params.d.ts`,
  `cache-life.d.ts`), wired in via `next-env.d.ts`; `tsconfig.json` includes both
  `.next/types/**` and `.next/dev/types/**`. Route types only exist after a `dev`/`build` run,
  so type errors about missing `LayoutProps`/`PageProps` usually mean the generator hasn't run.
- App Router only (`app/`), TypeScript strict, `@/*` path alias mapped to the repo root.

## Styling

Tailwind v4 — there is **no** `tailwind.config.*` file, and adding one won't be picked up.
Configuration lives in `app/globals.css`: `@import "tailwindcss"` plus an `@theme inline` block
mapping CSS custom properties to Tailwind tokens. Extend the theme there.

- **The palette is owned by the product owner.** The hex values under `:root` and `.dark` were
  supplied verbatim and should not be "corrected" to oklch or re-derived. Tokens shadcn needs
  but the brief did not list (popover, chart, sidebar, success, warning) are derived from the
  same indigo/slate family and are marked as such.
- Dark mode is **class-based** (`@custom-variant dark (&:is(.dark *))` + `next-themes` with
  `attribute="class"`), not `prefers-color-scheme`. Don't reintroduce the media query.
- `--font-app-sans` puts Geist first and IBM Plex Sans Thai second so Latin and Thai glyphs fall
  through per-glyph. Geist has **no Thai coverage** — never drop the Thai face from the stack.
- Use the `.text-th` utility on any element that can render Thai; tone marks and stacked vowels
  clip at the default leading.
- **A `TabsList` never wraps.** It has a fixed height, so a second row spills outside the pill —
  which is exactly what the seven vocabulary categories did on a phone. Give the list
  `no-scrollbar flex w-full justify-start overflow-x-auto` and the triggers
  `shrink-0 sm:flex-1`: the rail scrolls sideways when it must and still stretches once there is
  room. `.no-scrollbar` is defined in `globals.css` alongside `.text-th`; the generated
  `components/ui/command.tsx` expects it to exist as well.

## shadcn/ui

Configured for **Radix** primitives (`base: "radix"` in `components.json`, style `radix-nova`).
This matters: Radix uses `asChild`, a string `defaultValue` on Accordion, `type="single"` on
ToggleGroup, and array values on Slider — the Base UI equivalents (`render`, `items`,
`nativeButton`) are wrong here. Add components with
`npx shadcn@latest add <name> --yes`; the CLI preserves the base from `components.json`.

## Architecture

Mock-data frontend, shaped so a real backend drops in without touching components.

- `lib/types.ts` — domain model, mirroring the brief's database tables.
- `lib/ai/` — the **only** seam to a tutor model. `types.ts` declares `AIService`;
  `mock-provider.ts` implements it with a local rule engine; `index.ts` resolves the singleton.
  Components call `getAIService()` and never import a provider. To go live, add an
  `HttpAIProvider implements AIService` and switch in `index.ts`.
  - `correction-rules.ts` holds the grammar rules, each with a Thai explanation. Rules carry a
    `weight`; only weight ≥ 15 forces a retry, because the brief says not to correct every
    small slip.
  - `evaluateAnswer` returns the exact JSON contract from the brief (§26) — `isCorrect`,
    `corrected`, `explanationThai`, `naturalAlternative`, `importantMistakes[]`,
    `encouragement`, `retryRequired`, plus a `score` used for XP and skill bars.
- `lib/data/` — curriculum (`lessons.ts` = 30 authored days; `curriculum.ts` = the full 84-day
  map, days past `AUTHORED_THROUGH_DAY` render locked), `vocabulary.ts`, `scenarios.ts`.
- `lib/store/use-app-store.ts` — Zustand + `persist`. Owns XP, streak, mistakes, vocabulary SRS,
  daily activity, profile **and the UI locale**. One persistence mechanism, one hydration
  boundary: gate anything progress-derived on `hasHydrated` or the server render will disagree.
- `lib/i18n/` — `dictionaries.ts` is UI chrome only; `th` is typed against `en`, so a missing
  Thai key is a compile error. Lesson content is bilingual regardless of locale by design.
- `lib/speech.ts` — browser TTS, deliberately independent of the AI provider.
- `app/(app)/` — route group giving every signed-in page the sidebar/bottom-nav shell while
  keeping URLs flat.

## App shell

`components/layout/app-shell.tsx` owns the signed-in chrome.

- **The desktop sidebar is `sticky top-0 h-dvh`, not a stretched flex item.** As a plain
  column it took the height of the document, so on a long route the footer (streak card,
  account row, sign-out) sat below the fold. The nav scrolls in its own `overflow-y-auto`
  region so the footer stays grounded.
- **Collapse state lives in the store** (`sidebarCollapsed` + `toggleSidebar`) and is
  persisted, so the rail survives a reload; `reset()` keeps it, like `locale`. Width is
  animated by Motion on the shared `transition` token rather than a Tailwind
  `transition-[width]`, so the rail and the `layoutId` pill — which re-measures on the same
  render — move together.
- **Nav sections come from `lib/nav.ts`.** Every `NavItem` carries a `group`, and
  `NAV_GROUPS` sets the order; labels are `t.navGroups[group]`. The collapsed rail swaps the
  labels for separators and puts each item's name in a tooltip.
- **Quick-jump (⌘K) is one provider, not one widget.** `components/layout/quick-jump.tsx`
  mounts the dialog and the key listener once in `AppShell`; the sidebar field and the mobile
  header button are triggers that call `useQuickJump()`. Two independent copies would both
  answer the shortcut and stack two dialogs. Items carry their English *and* Thai text in
  cmdk's `value`, which is what makes a Thai query match.
- **`AuthGate` sits inside `AppShell`, not around it.** The store rehydrates a beat after
  mount; gating the whole shell meant a phone painted loose skeleton blocks on an empty
  background and then dropped the entire app in at once. The chrome renders immediately and
  only `<main>` waits. The personal values in the chrome (streak, XP, level, name, email,
  avatar monogram) are gated on `hasHydrated` behind same-size skeletons, so nothing shows a
  default that then changes — and skeletons drawn on the accent panel need
  `bg-sidebar-accent-foreground/15`, because `bg-muted` is nearly the panel's own colour in
  light mode.
- **Sign-out has three homes, none of them a stray button.** Desktop: behind the sidebar's
  account row, as a `destructive` item in the same dropdown as Profile (`AccountMenu`, shared
  by the expanded row and the collapsed rail's avatar). Mobile: the last entry of the drawer's
  `account` group, beside Profile. Permanent: the account section of `/profile`. Don't
  reintroduce a full-width sign-out under the nav — it reads as one more menu item and sits
  where a mis-tap is easy.
- **Mobile gets the whole menu in a drawer.** The bottom bar only fits the five `primary`
  routes, so Progress and Profile had no way in on a phone. `components/layout/mobile-menu.tsx`
  (a Sheet behind the header avatar) carries the full grouped nav, the account, streak/XP and
  the language/theme controls — those two moved out of the header because it cannot hold them
  next to the menu button at 390px. Anything added to `NAV_ITEMS` shows up there automatically;
  the tab bar still only shows `primary` items, and `grid-cols-5` assumes there are five.
- **Palette deep links:** lessons use `/learn/{id}`; scenarios and vocabulary use
  `?scenario=` and `?q=`, read once with `useSearchParams` to seed local state. Both pages
  therefore need a `Suspense` boundary above that read or the prerender fails.

## Animation (Motion)

`motion` v13 (the motion.dev package, which re-exports framer-motion). Import from
`motion/react`.

- **All timing lives in `lib/motion.ts`** — durations, the ease-out curve, and the shared
  variants (`fadeUp`, `panelSwap`, `messageIn`, `feedbackIn`, `staggerContainer`). Don't tune
  a duration inline; change the token or add a variant, so the app keeps reading as one system.
  The brief's "minimal / not childish / suitable for adults" (§22) means short durations and
  ease-out — **no bounce, no overshoot**, ever.
- **Reduced motion is handled once**, by `<MotionConfig reducedMotion="user">` in
  `components/providers.tsx`. Never branch render output on `useReducedMotion()` — that
  reintroduces the server/client mismatch class of bug. Reading it *inside an effect* to pick a
  duration (as `AnimatedNumber` does) is fine.
- **Counters count in on scroll.** `AnimatedNumber` in `components/ui-kit.tsx` holds at `from`
  (default 0) until it enters the viewport, then tweens to `value`; it re-runs when `value`
  changes while in view, which is how it picks up progress rehydrated from localStorage a beat
  after mount. It drives `animate()` on a `useMotionValue` rather than React state, because a
  `setState` tween in an effect trips this repo's `set-state-in-effect` rule *and* re-renders
  the subtree every frame. Note the consequence: above-the-fold counters (the dashboard tiles)
  are in view on load, so they roll up on **every** visit to that page, not just the first.
  That is the requested behaviour; if it ever reads as repetitive, gate the effect on a
  module-level "already counted" set rather than removing it.
- **`viewportOnce`'s margin is vertical-only, and must stay that way.** A bare `"-60px"`
  shrinks the IntersectionObserver root on all four sides, so on a phone anything within 60px
  of the left or right edge never intersects and never animates. That is why the vocabulary
  "due today" counter read 0 on mobile while desktop — where the sidebar pushes content clear
  of the inset — showed the real number. Any new margin needs an explicit horizontal `0px`.
- **Reveal-on-scroll must still track later changes.** `MeterRow` uses `useInView` + `animate`,
  not `whileInView`: a `once: true` `whileInView` fires and then ignores value changes, so a bar
  would freeze at its first reading after the learner completes a lesson.
- **Motion owns the meters.** `MeterRow` and `ProgressRing` previously animated via Tailwind
  `transition-[width]` / `transition-[stroke-dashoffset]`. Those utilities were removed — if you
  put them back, the two systems fight and the bars stutter.
- **`AnimatePresence` needs `mode="wait"`** wherever a click follows the transition (lesson
  stages, practice questions, vocabulary review). With the default `sync`, the exiting panel is
  still mounted, so a fast click can land on the screen the learner just left.
- **Never key an animated list on translated text.** A `variants` child under a
  `whileInView` + `once: true` parent gets its "show" variant pushed down by the parent at the
  moment the viewport observer fires — and with `once` that observer is then gone. Change the
  locale and a `key={title}` child unmounts; the replacement mounts with
  `whileInView.isActive === false`, so it inherits `initial="hidden"` and is stranded at
  `opacity: 0`. Dropping `once` is **not** the fix — `setActive` early-returns while the type is
  already active, so the new child stays hidden until the parent leaves and re-enters the
  viewport; with `once` it never recovers. Keys in animated lists must be locale-independent
  (`id`, `href`, an index-free slug) — the landing `features` array and `progress`
  `skillRows` carry an explicit `id` for exactly this reason. The same remount also resets
  `AnimatedNumber` to 0 and `MeterRow`'s bar to empty until they re-enter the viewport.
- **Never share a `layoutId` between the sidebar and the bottom nav.** Both are always in the
  DOM — only CSS hides one — so a shared id makes Motion animate between two visible-to-it
  elements. They use `sidebar-active` and `bottomnav-active`.
- **Leave the shadcn primitives alone.** Dialog, Popover, Select, Sheet and Tooltip animate via
  `tw-animate-css` driven by Radix `data-state`. Motion is scoped to app-level content only.
- **Bundle cost:** Motion is ~47 KB gzipped, in its own shared chunk (so it is fetched once and
  cached across routes). This was measured, not estimated. `LazyMotion` + `m` would reduce it;
  the blocker is that `layoutId` needs the `domMax` feature set rather than `domAnimation`. How
  much that actually saves has **not** been measured — if the bundle matters, the thing to try
  is dropping the two nav `layoutId` indicators (re-doing them as a CSS-transformed element),
  then switching to `LazyMotion` + `domAnimation`.

### Two conventions worth knowing

- **Never render "Wrong".** The correction UI (`components/feedback-card.tsx`) is built around
  the brief's rule that mistakes must feel normal: "Almost! 👍", the learner's sentence shown
  plainly, the fix framed as "Try this", the reason always in Thai.
- **`react-hooks/set-state-in-effect` is an error here.** For values that only exist in the
  browser (resolved theme, speech support, the current hour) use `useIsClient()` from
  `lib/use-is-client.ts` — a `useSyncExternalStore` shim — not `useState` + mount effect.

## State of the repo

Frontend MVP complete against the product brief: landing page, login/register (local-only auth),
dashboard, 30-lesson learn flow with the six-stage player, practice, AI conversation, progress
with mistake tracking, vocabulary with spaced review, and profile. No real AI call is made —
everything runs off `MockAIProvider`. Motion animations are wired through the app. Voice input,
real auth and the NestJS backend are the declared next phases.
