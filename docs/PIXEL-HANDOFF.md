# Handoff: Pixel-game portfolio site (rishiraj.dev)

## Overview
A personal portfolio site for Rishi (rishirajFS) themed as a 2D pixel game. Two screens are in
scope for this handoff:

- **2a — Home / hero.** The landing screen: sky-and-dirt voxel world, identity hero, a beveled
  "Projects" GUI panel, a HUD (hearts / armor / XP) and a 9-slot hotbar acting as primary nav.
- **4a — Inventory.** The project index, presented as a full-screen game inventory GUI layered
  over the paused world. All 33 GitHub repos are grouped into Recently pushed / Machine learning /
  Software engineering / Just for fun, with a hover tooltip and a repo detail panel.

2a is the entry point; opening the inventory (hotbar slot, `E`, or the OPEN INVENTORY button)
transitions to 4a.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes that show the
intended look and behavior. They are not production code to copy directly.

The task is to **recreate these designs in the target codebase's existing environment** (React,
Vue, SvelteKit, Astro, etc.) using its established patterns, component library and build setup.
If no codebase exists yet, pick the most appropriate framework for a static personal site
(Astro or Next.js static export are both good fits, given the content is a GitHub repo list) and
implement the designs there.

The prototypes are written as a single streaming HTML document with inline styles and no CSS
classes. That is a constraint of the prototyping environment, **not** a recommendation — in the
real implementation, extract the repeated primitives (bevel panel, item slot, tab, HUD bar) into
components with proper styling.

## Fidelity
**High-fidelity.** Colors, typography, spacing, bevel widths and the 4px pixel grid are final and
should be reproduced exactly. Two deliberate exceptions:

1. **Sprite artwork is not final.** Every item icon in the prototypes is a flat colored square
   standing in for real pixel art. See *Assets*.
2. **Copy in 2a is placeholder** apart from the repo data. 4a's repo names, ordering, descriptions
   and language colors are real.

## Screens / Views

### 2a — Home / hero

**Purpose:** Establish who Rishi is and route to the four main sections.

**Canvas:** 1040 x 720 in the prototype. In production this is a full-viewport layout; treat 1040
as the design width and scale/reflow from there.

**Layout:** a single positioned stage. Background is painted in horizontal bands; foreground
elements are absolutely positioned against the stage.

Background band stack (top to bottom, y in design px):
| Band | y | Height | Fill |
| --- | --- | --- | --- |
| Sky 1 | 0 | 112 | `#6d9dff` |
| Sky dither 1 | 112 | 32 | 8px checker `#8cb8ff` on `#6d9dff` |
| Sky 2 | 144 | 96 | `#8cb8ff` |
| Sky dither 2 | 240 | 32 | 8px checker `#a9cbff` on `#8cb8ff` |
| Sky 3 | 272 | 96 | `#a9cbff` |
| Grass top | 368 | 16 | `#8ac249` |
| Grass dither | 384 | 16 | 8px checker `#8ac249` on `#6f9f37` |
| Dirt | 400 | rest | `#8d6144` + 32px block grid + 8px checker noise |
| Dirt vignette | 560 | rest | `linear-gradient(transparent, rgba(0,0,0,.45))` |

The dither bands are the key texture device — they replace smooth gradients everywhere in this
design. Implementation: `repeating-conic-gradient(<light> 0% 25%, <dark> 0% 50%)` at
`background-size: 8px 8px`.

Clouds are hard-edged rectangles composed with `box-shadow` offsets on 16px/32px multiples, drifting
horizontally (see *Interactions*).

**Components**

*Top bar* — x32, y28, width 976, height 56.
- Panel: `#c6c6c6`, 4px bevel (top/left `#fff`, right/bottom `#565656`), plus a 4px `#1a1a1a` outer ring
  via `box-shadow: 0 0 0 4px #1a1a1a`.
- Left: 32px logo slot + wordmark "rishiraj.dev", Silkscreen 14px `#2b2b2b`, text-shadow `2px 2px 0 #a0a0a0`.
- Right: nav buttons Work / Notes / About (inactive: `#a8a8a8`, 3px bevel `#d8d8d8`/`#6a6a6a`,
  Silkscreen 11px `#3a3a3a`, padding 7px 12px) and Contact (active/primary: `#4a8f2c`,
  bevel `#7cc84c`/`#2c5d18`, text `#fff`).

*Hero* — x32, y120, width 512.
- Headline "RISHI / BUILDS / SYSTEMS", Silkscreen 700, 56px, line-height 1.05, `#fff`,
  text-shadow `4px 4px 0 #3a3a3a`. "SYSTEMS" is `#ffcc33`.
- Body plate: `rgba(20,20,20,.62)`, 4px solid `#1a1a1a`, padding 14px 16px, max-width 456.
  Text Silkscreen 12px / line-height 1.9, `#e8e8e8`.
- Buttons: "OPEN INVENTORY" (green, as Contact above, 4px bevel + 4px `#1a1a1a` ring, padding
  14px 20px, Silkscreen 12px) and "RESUME" (`#7a7a7a`, bevel `#a8a8a8`/`#4a4a4a`, text `#e8e8e8`).

*Projects panel* — right 32, y112, width 432.
- Same `#c6c6c6` panel treatment as the top bar, padding 12.
- Heading "Projects", Silkscreen 12px `#3a3a3a`, text-shadow `1px 1px 0 #e0e0e0`.
- 5-column grid of item slots, gap 4. Slot: `#8b8b8b` with an INVERTED 3px bevel
  (top/left `#373737`, right/bottom `#fff`) — inset slots vs raised panels is the core visual grammar.
- Below the grid: 104x132 character-render slot + an "EQUIPPED" list of four language rows
  (`#a8a8a8`, 2px bevel, 16px color chip + Silkscreen 10px label): PyTorch `#3f6ea8`, AWS `#c98a2e`,
  Java `#8a4a9c`, React `#4a8f2c`.

*Item tooltip* — right 32, y472, width 328.
- `rgba(16,0,24,.86)`, 4px `#2b0a4a` border, 4px `#100018` outer ring, padding 10px 12px.
- Title Silkscreen 12px `#fff`; meta 10px / 1.7 `#a8a8ff`; rarity line 10px `#ffcc33`.
- This is the standard tooltip treatment; reuse it in 4a.

*HUD* — x32, bottom 132.
- Hearts row: nine 18x16 shapes, `clip-path: polygon(18% 0,50% 18%,82% 0,100% 32%,50% 100%,0 32%)`,
  full `#d8342a`, empty `#4a2320`, gap 2.
- Armor row: six 18x16, `clip-path: polygon(0 0,100% 0,100% 55%,50% 100%,0 55%)`, full `#c9c9c9`,
  empty `#3c3c3c`.
- XP bar: centered, 520x12, track `#1a1a1a` with a 2px `#000` ring, fill `#7cff5c` at 78%.
  Level number above, Silkscreen 14px `#7cff5c`, text-shadow `2px 2px 0 #1a3a10`.

*Hotbar* — centered, bottom 24. Nine 56x56 slots in a `#c6c6c6` panel (4px bevel + 4px `#1a1a1a` ring),
padding 4, no gap. Slots use the inverted 3px bevel. The selected slot gets
`outline: 4px solid #fff; outline-offset: -1px`. Each filled slot holds a 28x28 color chip.
Hotbar slots are the primary nav: Home, Work, Skills, Blog, About, CV, Mail.

### 4a — Inventory (project index)

**Purpose:** Browse all 33 GitHub repos, grouped and filterable, and open one.

**Canvas:** 1240 x 840.

**Layout:** the 2a world renders behind at reduced contrast (same band stack, plus a full-bleed
`rgba(10,10,14,.55)` scrim). Over it: a tab strip, then one large GUI panel.

- Tab strip: x60, y24, flex row, gap 4, aligned to bottom. Tabs sit ON the panel's top edge.
  - Active: `#c6c6c6`, 4px bevel top/left `#fff` + right `#565656`, **no bottom border**,
    padding 10px 16px 12px, Silkscreen 11px `#2b2b2b`.
  - Inactive: `#8b8b8b`, bevel `#b8b8b8`/`#4a4a4a`, padding 8px 16px 10px, text `#e0e0e0`, sits 2px lower.
  - Tabs: ALL 33 · **ML 13** (active) · SWE 12 · FUN 8 · PRIVATE 3.
- Panel: x60, y80, 1120 x 716, `#c6c6c6` 4px bevel + 4px `#1a1a1a` ring, padding 20,
  `display:flex; gap:16; box-sizing:border-box`.

**Column 1 — character, width 280**
- Label "Rishi", Silkscreen 12px `#3a3a3a`.
- 268px-tall character render slot (inverted 3px bevel).
- Four 52px equipped-language slots with 24px chips: `#3572A5`, `#b07219`, `#e34c26`, `#f1e05a`.
- Stats box (`#a8a8a8`, 3px bevel, padding 12): REPOS 33 · STARS 2 · FOLLOWING 1 · ACHIEVEMENTS 2,
  Silkscreen 10px, space-between rows.
- Achievements box (same treatment): YOLO (`#ffcc33` chip) and Pull Shark (`#3f6ea8` chip).
- Contribution strip: 12x12 squares, gap 2, wrapping. Scale, dark to light:
  `#1d3a10`, `#2f6b1c`, `#4a8f2c`, `#7cc84c`.

**Column 2 — repo grid, width 500**
- Search field: full-width inverted-bevel slot, Silkscreen 11px `#e8e8e8`, prompt `>`,
  placeholder "search repos", 2x14 caret blinking on a 1s step.
- Then four labelled sections, each a heading row + a 6-column grid of 80px cells (gap 4,
  `grid-template-columns: repeat(6, 80px)`):
  - **Recently pushed** (last 6): jachacks, llm-sycophancy, vllm-kv-tier,
    **claude-session-manager** (selected), self-healing-agent, pokerai.
  - **Machine learning** (13 repos): vllm-kv-tier, llm-sycophancy, self-healing-agent,
    self-healing-agent-test, pokerai, idlhw4, llmsyshw4, llmsyshw_redo, llmsys_hw3, llmsyshw3,
    MotionDet, BallMotion-PhysicsGen, then a `+1` overflow cell.
  - **Software engineering** (12 repos): claude-session-manager, pa-broadband-inequality,
    cloud-docker-k8s, cloud-dock, containers-devops, clood, cloud-p5, cloud-sql-nosql, cloud-hw3,
    cloud-pagerank, cloud-computing-ELASTICITY, cloud-computing-proj0.
  - **Just for fun** (8 repos): jachacks, nudge, Kankatti, trial, FettesSchwein.github.io,
    github-slideshow.
- Section heading row: title Silkscreen 10px `#3a3a3a` left, count 9px `#5a5a5a` right, space-between.
- Repo cell: 80px tall, inverted 3px bevel, column flex, centered, gap 5, padding 4,
  `box-sizing: border-box`, `overflow: hidden`. Contains a 26x26 language chip and the repo name in
  Silkscreen 6px / line-height 1.35, `#f2f2f2`, `text-align:center`,
  `text-shadow: 1px 1px 0 #3a3a3a`, `overflow-wrap: anywhere`.
- Selected cell: `outline: 3px solid #fff; outline-offset: -3px`.
- Overflow cell (`+1`): same slot, centered Silkscreen 10px `#d8d8d8`.
- Empty cell: slot with no children.

**Column 3 — detail, width 268**
- Repo card, tooltip treatment (`#1c1024`, 4px `#2b0a4a`, 4px `#100018` ring, padding 12):
  title Silkscreen 12px `#fff`; subtitle 10px/1.8 `#a8a8ff`; body 10px/1.8 `#8a8a9a`;
  language row (10px chip + 10px `#d8d8e8` label); commit line 10px `#ffcc33`.
  Current content: **vllm-kv-tier** — "Tiered KV cache with memory-aware eviction" /
  "vLLM fork. Eviction policy instrumentation, SLURM sweeps on PSC." / Python / `27f5d58 · main`.
- Languages box (`#a8a8a8`, 3px bevel): a 12px stacked bar with a 2px `#4a4a4a` ring —
  Python 44% `#3572A5`, HTML 30% `#e34c26`, Java 16% `#b07219`, JS 10% `#f1e05a` — and a wrapped
  legend at Silkscreen 9px.
- Buttons: "OPEN ON GITHUB" (green primary) and "CLONE" (gray secondary), full width, padding 12,
  centered, Silkscreen 11px.
- Footer note pinned with `margin-top:auto`: "33 repos synced from github.com/rishirajFS",
  Silkscreen 9px/1.8 `#3a3a3a`.

**Hover tooltip** — currently anchored to the llm-sycophancy cell in the ML grid, offset
`left:64px; top:44px`, width 284, z-index 6. Its host cell must NOT have `overflow:hidden`.
Content: repo name, description (or "No description set" `#5a5a6a`), "Python · main" `#8a8a9a`,
and `rishirajFS/<repo>` `#5a5a6a`.

**Tooltip placement rule for implementation:** open down-and-right by default, but flip to
up/left when the tooltip would cross the grid column's bounds. In the prototype this is static;
in production compute it from the hovered cell's rect.

## Interactions & Behavior

- **Cloud drift (2a):** `background-position` 0 → 240px over 40s, `linear infinite`.
- **Caret blink:** `opacity` 1 → 0 at the 50% mark, `1s steps(1,end) infinite`.
- **Sprite bob:** `translateY(0 → -4px → 0)`, 1.4–2.4s. Use `steps(2,end)` for a 2-frame game
  feel rather than smooth easing.
- **Slot hover:** show the tooltip and lighten the slot fill (`#8b8b8b` → `#9b9b9b`).
- **Slot click:** load that repo into the detail column; move the white selection outline.
- **Tab click:** filter the grid to that category. Tabs are currently static; making them live is
  the first behavior to implement.
- **Search:** filter cell list by substring across all sections.
- **Open inventory:** 2a → 4a. Suggested transition — scrim fades in over ~120ms, panel scales
  from 0.96 to 1. Keep it short; the aesthetic is snappy, not floaty.
- **Keyboard:** `E` or `Esc` toggles the inventory; arrow keys move slot focus; `Enter` opens.
- **Reduced motion:** disable drift and bob under `prefers-reduced-motion`.
- **Responsive:** below ~1100px the 4a three-column panel should stack — character panel collapses
  to a header strip, grid goes 4 columns, detail becomes a bottom sheet. 2a's hotbar can scroll
  horizontally. Neither is designed yet; ask before inventing it.

## State Management
- `activeTab`: 'all' | 'ml' | 'swe' | 'fun' | 'private' (default 'ml' in the current mock)
- `query`: search string
- `selectedRepo`: repo id driving the detail column (default `vllm-kv-tier`)
- `hoveredRepo`: repo id driving the tooltip, plus the hovered cell's rect for flip logic
- `inventoryOpen`: boolean, 2a vs 4a
- **Data:** repo list from the GitHub REST API — `GET /users/rishirajFS/repos?sort=pushed&per_page=100`.
  Fields used: `name`, `description`, `language`, `pushed_at`, `html_url`, `private`, `owner.login`.
  Category (ml / swe / fun) is NOT in the API — keep a hand-maintained map keyed by repo name, with
  an `fun` fallback. Fetch at build time and commit the JSON; do not call the API from the browser.

## Design Tokens

**Panel / chrome**
| Token | Value |
| --- | --- |
| panel-face | `#c6c6c6` |
| panel-bevel-light | `#ffffff` |
| panel-bevel-dark | `#565656` |
| panel-ring | `#1a1a1a` |
| slot-face | `#8b8b8b` |
| slot-bevel-dark (top/left) | `#373737` |
| slot-bevel-light (right/bottom) | `#ffffff` |
| subpanel-face | `#a8a8a8` |
| subpanel-bevel-light | `#d0d0d0` |
| subpanel-bevel-dark | `#6a6a6a` |
| tab-inactive | `#8b8b8b` |

**World**
| Token | Value |
| --- | --- |
| sky-1 / 2 / 3 | `#6d9dff` / `#8cb8ff` / `#a9cbff` |
| grass-light / dark | `#8ac249` / `#6f9f37` |
| dirt | `#8d6144` |
| scrim | `rgba(10,10,14,.55)` |

**Accent / semantic**
| Token | Value |
| --- | --- |
| primary (green) | `#4a8f2c`, bevel `#7cc84c` / `#2c5d18` |
| secondary (gray) | `#7a7a7a`, bevel `#a8a8a8` / `#4a4a4a` |
| gold / highlight | `#ffcc33` |
| xp-fill | `#7cff5c` |
| health-full / empty | `#d8342a` / `#4a2320` |
| armor-full / empty | `#c9c9c9` / `#3c3c3c` |
| tooltip-bg | `rgba(16,0,24,.86–.96)` |
| tooltip-border / ring | `#2b0a4a` / `#100018` |
| tooltip-meta | `#a8a8ff` |
| tooltip-muted | `#8a8a9a` |
| tooltip-dim | `#5a5a6a` |

**Language colors** (GitHub linguist)
Python `#3572A5` · Java `#b07219` · HTML `#e34c26` · JavaScript `#f1e05a` ·
Dockerfile `#384d54` · unknown `#6a6a6a`

**Contribution scale:** `#1d3a10` → `#2f6b1c` → `#4a8f2c` → `#7cc84c`

**Spacing:** everything is a multiple of 4. Common: 4, 8, 10, 12, 16, 20, 24, 32.
Bevels are 3px (slots, subpanels) or 4px (panels, buttons, tabs). Rings are 4px.

**Radius:** none. Every corner is square — this is load-bearing for the aesthetic.

**Typography:** Silkscreen (Google Fonts), weights 400 and 700.
| Role | Size / line-height |
| --- | --- |
| Hero headline | 56 / 1.05, weight 700 |
| Panel heading | 12 / 1 |
| Body plate | 12 / 1.9 |
| Nav + button | 11 / 1 |
| Section heading | 10 / 1 |
| Stat row, tooltip meta | 10 / 1.8 |
| Count, footnote | 9 / 1.8 |
| Repo cell name | 6 / 1.35 |

6px type is only legible because Silkscreen is a bitmap face rendered at an integer size — do not
substitute another font at that size, and do not scale it fractionally.

**Rendering:** set `image-rendering: pixelated` on the stage and any sprite, and keep all sizes on
integer pixels. Fractional layout will visibly soften the bevels.

## Assets
- **Fonts:** Silkscreen (Google Fonts, OFL) — used throughout both screens. VT323 and
  Press Start 2P appear in other options in the same prototype file but not in 2a or 4a.
- **Sprites: NOT SUPPLIED.** Every icon is a flat colored square placeholder. In the prototype these
  are `<image-slot>` drop targets so the designer can drop art in. Real 16x16 or 32x32 pixel art is
  needed for: the wordmark mark, the character render, the four equipped-language icons, the
  hotbar's seven nav icons, and per-language repo icons. Source these as original or licensed art
  (Kenney, itch.io CC0, or commissioned). **Do not ship ripped assets from any commercial game** —
  the prototype deliberately contains none.
- **Repo data:** GitHub REST API, live at time of writing (33 repos, 3 private).

## Files
| File | What it is |
| --- | --- |
| `Portfolio Pixel Mockups.dc.html` | The full prototype. Options are grouped by turn; `#4a` is the inventory, `#2a` the home screen. Other turns are earlier explorations — ignore them. |
| `image-slot.js` | The drop-target web component used for sprite placeholders. Prototype tooling only; do not port it. |
| `github.md` | Sync record: which repo/commit the data came from and which screens map to it. |

Open the prototype in a browser and jump to `#2a` / `#4a` to see them live.
