<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes: APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Working in this repo

Personal portfolio site. Next.js 16 App Router, React 19, Tailwind CSS 4,
TypeScript, Motion (`motion/react`).

```bash
npm run dev     # http://localhost:3000
npm run build   # typechecks and prerenders every route. Run before claiming done
npm run lint
```

## The two invariants

Break either of these and the architecture stops paying for itself.

**1. Content lives in `src/content/`, never in a component.**
Components import from `@/content` and render what's there. Every optional field
is conditionally rendered, so partial content entries are safe. Content is
Zod-validated at module load (`src/content/schema.ts`), so a bad field fails the
build with an exact path instead of shipping broken.

**2. Design values live in `src/styles/tokens.css`, never in a component.**
No hex colors, no `transition-duration: 300ms`, no hand-set section padding.

The theme is a 2D voxel-game GUI. Read `THEME.md` before touching anything
visual, and `docs/PIXEL-HANDOFF.md` for the spec it implements. Three rules are
load-bearing:

1. **Zero border radius.** Every corner square. `rounded-*` is mapped to `0` on
   purpose so it cannot creep back in.
2. **Bevels, not shadows.** Depth is a hard 3px/4px border, light top-left and
   dark bottom-right for raised, inverted for inset slots. Use the `bevel-*`
   utilities in `globals.css`. Never write a `box-shadow` for elevation.
3. **Dither, not gradients.** Tonal steps are 8px checkerboards via the `.dither`
   utility. The dirt vignette in `world.tsx` is the only gradient in the design.

Sizes are integer pixels on a 4px grid, because fractional layout visibly softens
the bevels. Silkscreen is a bitmap face: never scale it fractionally, never
antialias it, and never substitute another family at the small sizes. Long-form
prose is the one exception and uses `.prose-site`, which switches to a readable
mono face.

**Use the component kit, do not rebuild it:** `src/components/pixel/`
(Panel, Subpanel, Slot, ItemChip, Tooltip, PanelHeading, PixelButton, Hearts,
Armor, XpBar, Hud, World, WorldScrim, GroundStrip, Hotbar) and
`src/components/inventory/` (the project browser).

No sprites are shipped. Every icon is a color chip via `<ItemChip>`, and shipping
ripped assets from any commercial game is out of the question. Real pixel art
drops in through that one component.

## Content accuracy

`VERIFICATION.md` records every résumé claim checked against the actual source
repos. Several did not hold up and were corrected or dropped.

**Do not "restore" a claim from the résumé without checking VERIFICATION.md
first.** Specifically: the SGLang PR is co-authored, not submitted by Rishi; only
WLFU was upstreamed; the self-healing agent's "two minutes" is unverified and
deliberately absent; the poker competition is CMU's, not Jump Trading's; and the
broadband project's FCC layer is synthetic data.

When a claim cannot be verified from source, put it in the project's `caveats`
field. It renders as a dev-only warning box and never appears in production.

## Conventions

- Import content via `@/content`, never from the individual files.
- Compose animation from the primitives in `components/motion/motion-primitives.tsx`
  (`Reveal`, `Stagger`/`StaggerItem`, `TextReveal`, `Parallax`, `Magnetic`). Don't
  write one-off animations. Timing consistency is the point.
- Every motion component must honor `useReducedMotion()` by rendering the final
  state, not a faster animation.
- Framer Motion needs real numbers, so `DUR` and `EASE_OUT` in
  `motion-primitives.tsx` duplicate the CSS duration tokens. Keep them in sync.
- `next/og` (`app/opengraph-image.tsx`) renders in Satori, which supports neither CSS
  custom properties nor `repeating-conic-gradient`, and loads no webfont. Its colors are
  hardcoded hex and the world bands are stacked divs on purpose. Update by hand.
- Sort keys are `YYYY-MM`, with optional `-DD` only to break ties inside a month.
- `src/content/repos.ts` is GENERATED. Edit `scripts/sync-repos.mjs` (which holds the
  hand-maintained category and rarity maps) and run `npm run sync:repos`.
- Icons go through `components/ui/icon.tsx`. lucide-react v1 dropped its brand
  icons, so GitHub and LinkedIn are local inline SVG paths there.

## Verifying a change

`npm run build` catches type errors and content-schema violations. For anything
visual, actually look at it. Check both day and night mode, and check mobile (390px)
for horizontal overflow.

Design widths are 1040px (home) and 1240px (inventory). Below ~1100px things must
reflow rather than overflow.
