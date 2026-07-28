# Theming

The site is a 2D voxel-game interface. The full design spec is in
[docs/PIXEL-HANDOFF.md](./docs/PIXEL-HANDOFF.md) and it is **high fidelity**:
colors, spacing, bevel widths and the 4px grid are final.

Everything visual is driven from **one file**: `src/styles/tokens.css`. No
component hardcodes a color, size, or duration.

---

## Three rules that carry the aesthetic

Break any one of these and the site stops looking like a game and starts looking
like a website wearing a costume.

### 1. Zero border radius

Every corner is square. There is no radius token that is not `0`, and Tailwind's
`rounded-*` utilities are mapped to `0` on purpose so they cannot silently
reintroduce one. Do not add a radius anywhere.

### 2. Bevels, not shadows

Depth is a hard 3px or 4px border: light on top and left, dark on right and
bottom for a **raised** surface, and inverted for an **inset** one.

Raised versus inset is the core visual grammar. Raised is chrome you look at.
Inset is a hole you put something in.

| Class | Use | Bevel |
| --- | --- | --- |
| `.bevel-panel` | window chrome | 4px, raised |
| `.bevel-ring` | the 4px black outer ring | add to a panel |
| `.bevel-subpanel` | a group inside a panel | 3px, raised |
| `.bevel-slot` | an item slot | 3px, **inset** |
| `.bevel-btn` + `.btn-primary` / `.btn-secondary` | buttons | 4px, raised, flips on press |
| `.btn-nav` | top-bar nav | 3px, raised |

Never write a `box-shadow` for elevation. The two shadow tokens that are not
`none` exist only for genuinely floating layers (tooltips, the inventory panel).

### 3. Dither, not gradients

Tonal steps are 8px checkerboards, via `repeating-conic-gradient`. The `.dither`
utility takes `--dither-light` and `--dither-dark`:

```jsx
<div className="dither" style={{ "--dither-light": "var(--sky-2)", "--dither-dark": "var(--sky-1)" }} />
```

The only gradient in the whole design is the dirt vignette, already handled in
`world.tsx`. A smooth sky gradient is the single fastest way to make this read as
a web page with a blue background.

Everything else: integer pixel sizes on a 4px grid. Fractional layout visibly
softens the bevels, which is why `image-rendering: pixelated` is set on `html`.

---

## Token groups

Read `src/styles/tokens.css` top to bottom. It is organized as:

- **Panel / chrome**: `--panel-face`, `--slot-face`, `--subpanel-face`, the
  bevel light/dark pairs, `--panel-ring`, and the chrome text colors.
- **World**: `--sky-1/2/3`, `--grass-light/dark`, `--dirt`, `--scrim`, plus the
  band heights and `--dither-size` / `--block-size`.
- **Accent / semantic**: `--primary` (green) and `--secondary` (gray) with their
  bevel pairs, `--gold`, the HUD colors (`--health-*`, `--armor-*`, `--xp-*`),
  the tooltip violet family, and the three rarity colors.
- **Shape**: bevel widths and ring width. All radii are `0`.
- **Typography**: the Silkscreen size scale, in whole pixels.
- **Layout**: 1040px home width, 1240px inventory width, 32px gutter.
- **Motion**: durations plus `steps()` easings.
- **Compatibility layer**: the older semantic names (`--color-bg`,
  `--color-fg-muted`, `--color-surface`) mapped onto the GUI palette, so the
  section components that predate this theme still render correctly.

### Re-tinting the world

The fastest meaningful change is the biome. Swap the world group:

| Biome | sky-1 / 2 / 3 | grass light / dark | dirt |
| --- | --- | --- | --- |
| Overworld (current) | `#6d9dff` `#8cb8ff` `#a9cbff` | `#8ac249` `#6f9f37` | `#8d6144` |
| Nether | `#3a0f0f` `#5a1a12` `#7a2a18` | `#8a3a20` `#5f2612` | `#4a1810` |
| End | `#0d0a14` `#151027` `#1e1836` | `#c8c49a` `#9a9670` | `#2a2440` |
| Snowy | `#8fb8e8` `#a8cbf0` `#c4dcf7` | `#e8f0f4` `#c0d0d8` | `#6d5a4a` |

GUI chrome deliberately stays gray in every one of them. A game's HUD does not
change color with the biome.

---

## Typography

Silkscreen, loaded in `src/app/layout.tsx` as `--font-pixel-src`.

It is a **bitmap face**, which has two consequences:

1. `-webkit-font-smoothing: none` is set on `body`. Antialiasing is what makes
   pixel type look blurry.
2. Sizes must be whole integers. The 6px repo-cell label in the inventory is
   only legible because Silkscreen renders exactly at 6px. Do not scale it
   fractionally and do not substitute another family at the small sizes.

The size scale, from `tokens.css`:

| Token | Size | Role |
| --- | --- | --- |
| `text-cell` | 6px | repo cell names |
| `text-2xs` | 9px | counts, footnotes |
| `text-xs` | 10px | stat rows, tooltip meta, section headings |
| `text-sm` | 11px | nav, buttons, tabs |
| `text-base` | 12px | body plate, panel headings |
| `text-md` | 14px | wordmark, level number |
| `text-5xl` | 56px | hero headline |

**One deliberate exception.** Long-form prose on project detail pages uses
`.prose-site`, which switches to JetBrains Mono (`--font-read-src`). Several
paragraphs of 12px Silkscreen is punishing to read. Headings, labels, stats and
buttons stay pixel.

Text treatments: `.emboss` (the 1px light shadow that stamps a label into a
panel), `.emboss-strong`, `.text-drop` and `.text-drop-lg` (hard shadow for text
over the world, where there is no panel behind it).

---

## Night mode

Not a color inversion. It is dusk: the sky darkens, grass and dirt cool off, and
**the GUI chrome stays exactly as bright**. That contrast is the point, so resist
"fixing" the panel colors in the `.dark` block.

`next-themes` writes `class="dark"` on `<html>`. The toggle is three-state in
`src/components/layout/theme.tsx`.

---

## Motion

Step timing, not easing. `--ease-out` is `steps(4, end)`, and the sprite bob is
`steps(2, end)` so there is no in-between position. Smooth interpolation is the
other thing that reads as "web" rather than "game".

Durations are short by design: 120ms to 240ms. The handoff's word is *snappy*.

Keyframes in `globals.css`: `cloud-drift` (40s), `sprite-bob`, `caret-blink`,
`panel-in` (the inventory's 0.96 to 1 scale), `scrim-in`.

`prefers-reduced-motion` is handled in one block at the bottom of `tokens.css`,
which zeroes the drift and bob durations. Every JS animation additionally checks
`useReducedMotion()`.

---

## Component kit

Use these. Do not rebuild them.

```
src/components/pixel/
  panel.tsx   Panel, Subpanel, Slot, ItemChip, Tooltip + Tooltip{Title,Meta,Muted,Dim}, PanelHeading
  button.tsx  PixelButton, PixelButtonLink   (variant primary | secondary | nav)
  hud.tsx     Hearts, Armor, XpBar, Hud
  world.tsx   World, WorldScrim, GroundStrip
  hotbar.tsx  Hotbar (primary navigation)
src/components/inventory/
  the 4a inventory screen: tabs, search, repo grid, character panel, detail panel
```

`languageColor()`, `rarityColor()` and `rarityLabel()` live in
`src/lib/languages.ts`.

---

## Sprites

**None are shipped.** Every item icon is a flat color chip via `<ItemChip>`.

The handoff is explicit that ripped assets from any commercial game must not be
shipped, and none are. Real 16x16 or 32x32 pixel art is still needed for: the
wordmark mark, the character render, the equipped-language icons, the hotbar's
nav icons, and per-language repo icons. Source them as original work or from a
CC0 set (Kenney, itch.io).

Because every placeholder goes through `<ItemChip>`, dropping real art in later
is a single component change rather than a hunt through the codebase.

---

## What NOT to do

- Don't add a border radius. Anywhere.
- Don't add a `box-shadow` for depth. Use a bevel class.
- Don't add a gradient. Use `.dither`.
- Don't use a fractional pixel size, or Silkscreen at a non-integer size.
- Don't antialias pixel type.
- Don't put content in a component. It goes in `src/content/`.
