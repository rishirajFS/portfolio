# Rishiraj Nagarajan, portfolio

Personal portfolio for Rishiraj Nagarajan, machine learning engineer and MCDS candidate
at Carnegie Mellon, built as a 2D voxel-game interface.

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript · Motion

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build, typechecks + prerenders every route
npm run lint
```

---

## Read these first

| File | Why |
| --- | --- |
| **[THEME.md](./THEME.md)** | The pixel-GUI design system: bevels, dither, the token groups, and the biome palettes. Start here before touching anything visual. |
| **[docs/PIXEL-HANDOFF.md](./docs/PIXEL-HANDOFF.md)** | The original high-fidelity design spec this implements. Colors, spacing and bevel widths are final. |
| **[VERIFICATION.md](./VERIFICATION.md)** | Every résumé claim checked against the actual repos. Several did not hold up. **Read before launch.** |

---

## How it's organized

```
src/
  content/          ← ALL copy and data. Zod-validated. Edit here, not in components.
    site.ts           identity, nav, socials, bio, headline
    experience.ts     work history
    projects.ts       projects, metrics, write-up bodies
    research.ts       publications
    skills.ts         skill groups
    education.ts      degrees
    coursework.ts     coursework repo clusters
    schema.ts         Zod schemas, the contract
    index.ts          the single import surface: `@/content`

  styles/
    tokens.css      ← ALL design decisions. Colors, type, spacing, motion.

  components/
    pixel/          THE KIT: Panel, Subpanel, Slot, ItemChip, Tooltip,
                    PixelButton, Hearts/Armor/XpBar/Hud, World, Hotbar
    inventory/      screen 4a: tabs, search, repo grid, character + detail panels
    home/           home-stage.tsx, the one client boundary (inventory overlay)
    sections/       one file per home-page section
    layout/         top bar (scroll-spy nav, theme toggle), footer
    ui/             Section shell + project cards
    motion/         Reveal, Stagger, TextReveal, Parallax, Magnetic

  lib/
    languages.ts    language and rarity colours
    seo.ts          page metadata + JSON-LD
    github.ts       optional live repo stats (ISR, degrades to null)
    format.ts       date/number display helpers
    cn.ts           class merge
    use-scroll-spy.ts, use-hydrated.ts

  app/
    page.tsx                    home: screen 2a, then the sections below it
    inventory/page.tsx          screen 4a standalone, for deep links
    projects/page.tsx           the written archive
    projects/[slug]/page.tsx    item detail, statically generated per project
    opengraph-image.tsx         generated 1200×630 social card
    sitemap.ts, robots.ts, not-found.tsx

scripts/
  sync-repos.mjs    regenerates content/repos.ts (npm run sync:repos)
```

### The two screens

`/` is screen **2a**: the voxel world, the identity hero, a Projects item panel,
the HUD, and a 9-slot hotbar that is the primary navigation.

The **inventory** (screen 4a) is the project browser: all 25 repositories grouped
into ML / SWE / Fun, searchable, with a hover tooltip and a detail panel. It opens
as an overlay from the hero button, the hotbar's Projects slot, or the `E` key,
and also lives at `/inventory` for deep links. `Escape` closes it.

### Two rules that keep it maintainable

1. **Content never lives in a component.** Add it to `src/content/`. Components
   read from `@/content` and render whatever is there. Every optional field is
   conditionally rendered, so partial entries are safe to ship.
2. **Components never hardcode a design value.** No hex colors, no `300ms`, no
   hand-set section padding. Use the bevel utilities and tokens, and compose from
   `components/pixel/` rather than rebuilding a panel. Zero border radius, bevels
   instead of shadows, dither instead of gradients. See THEME.md.

Together those mean a theme change touches `tokens.css` plus maybe
`visuals/backdrop.tsx`, and a content change touches exactly one file in
`src/content/`.

---

## Adding a project

Append to the array in `src/content/projects.ts`. Only `slug`, `title`,
`tagline`, `tier`, `category`, `start`, `sortKey`, `status`, and `summary` are
required. Everything else renders if present and is skipped if absent.

`tier` controls treatment:

- `featured`: full-width alternating block on the home page, plus a detail page
- `secondary`: card in the grid, plus a detail page
- `minor`: one line in the "Earlier" list, no detail page

The detail route, `generateStaticParams`, and the sitemap all derive from this
array. Nothing else to register.

If you set `repo: "owner/name"`, the detail page fetches live GitHub stats
(hourly ISR). Set `GITHUB_TOKEN` to lift the rate limit from 60/hr to 5,000/hr; a
read-only, no-scope token is enough. Without it the stats block just doesn't
render.

Content is validated by Zod at module load, so a bad slug or a missing required
field fails `npm run build` with the exact path rather than shipping broken.

---

## Accessibility

Built in, not bolted on: skip-to-content link, one keyboard-only focus ring
defined once in `globals.css`, semantic landmarks, `aria-current` on the active
nav item, labelled icon-only buttons, and screen-reader hints on every link that
opens a new tab.

`prefers-reduced-motion` is handled in one place in `tokens.css` **and** checked
by every motion component. Reduced-motion users get the final state
immediately, not a faster animation.

---

## Before launch

Blocking items are tracked in **[VERIFICATION.md](./VERIFICATION.md)**. The short
version:

- [ ] Set the real domain in `site.siteUrl` (drives OG tags, canonical URLs, sitemap, robots)
- [ ] Confirm the LinkedIn vanity URL
- [ ] Decide whether the phone number belongs on a public page
- [ ] Resolve the flagged claims in VERIFICATION.md §1, §4, §5, §6
- [ ] Confirm Different Labs clearance on the experience figures (300 user-hours, 47%, 25%)
- [x] Résumé PDF in `public/` replaced with the October 2026 MLE résumé; web copy mirrors it
- [ ] Commission or source the pixel sprites (see THEME.md → Sprites). Everything
      is a colour chip via `<ItemChip>` until then, which is deliberate but
      unfinished-looking in places, notably the character render slots.

## Deploying

Live at **https://rishinagarajan.vercel.app**, on Vercel's free Hobby plan.

`main` is the production branch and the GitHub repo is connected, so pushing to
`main` builds and deploys. No configuration needed: Vercel detects Next.js.

`GITHUB_TOKEN` is the only environment variable, and it is optional. Without it
the live repo-stats block on project pages hides itself whenever GitHub's 60/hr
unauthenticated limit is hit. A read-only, no-scope token fixes that.

Manual deploy, if you need one: `npx vercel --prod`.
