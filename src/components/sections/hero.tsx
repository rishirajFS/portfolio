import Link from "next/link";

import { PixelButton, PixelButtonLink } from "@/components/pixel/button";
import { Armor, Hearts, Hud, XpBar } from "@/components/pixel/hud";
import {
  ItemChip,
  Panel,
  PanelHeading,
  Slot,
  Subpanel,
} from "@/components/pixel/panel";
import { World } from "@/components/pixel/world";
import {
  countIn,
  featuredProjects,
  repos,
  secondaryProjects,
  site,
} from "@/content";
import { languageColor, rarityColor, rarityLabel } from "@/lib/languages";

/**
 * 2a - Home / hero.
 *
 * One positioned stage over the voxel world, laid out at the handoff's 1040px
 * design width: hero block at x32/y112, projects panel at right 32/y112, HUD at
 * x32/bottom 132. Below 1100px the same three blocks stack in normal flow, so
 * nothing is ever wider than the viewport.
 *
 * The hotbar is deliberately absent. It is another component, and the page
 * composes it under this section.
 */

/* ------------------------------------------------------------------ headline */


/* ------------------------------------------------------------------- content */

type Item = {
  slug: string;
  title: string;
  rarity: "legendary" | "rare" | "common";
};

/**
 * Item frames mirror project tier, which is what the rarity palette was built
 * for: featured builds are legendary, the secondary ones rare.
 */
const items: Item[] = [
  ...featuredProjects.map((p) => ({
    slug: p.slug,
    title: p.title,
    rarity: "legendary" as const,
  })),
  ...secondaryProjects.map((p) => ({
    slug: p.slug,
    title: p.title,
    rarity: "rare" as const,
  })),
];

/** Two full rows of five. Anything past the real items stays an empty slot. */
const GRID_SLOTS = 10;
const emptySlots = Math.max(0, GRID_SLOTS - items.length);

/**
 * The four equipped languages, ranked by how much of the code they actually
 * are: sum each repo's per-language percentage. Counting repos instead would
 * rank Shell (one build script in ten repos) above Java (most of six).
 */
function equippedLanguages() {
  const share = new Map<string, number>();

  for (const repo of repos) {
    for (const lang of repo.languages) {
      share.set(lang.name, (share.get(lang.name) ?? 0) + lang.pct);
    }
  }

  return [...share.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name]) => name);
}

/**
 * The XP bar means something: level is the number of public repos, and the fill
 * is the share of them that is machine-learning work.
 */
const mlCount = countIn("ml");
const mlShare = mlCount / repos.length;

/* --------------------------------------------------------------- primitives */

/** One 76px item cell. Fluid below the design width so five still fit at 390px. */
const CELL = "aspect-square w-full stage:w-[76px]";

function EquippedRow({ language }: { language: string }) {
  return (
    <Subpanel as="li" className="flex h-6 items-center gap-2 px-1.5">
      <ItemChip color={languageColor(language)} size={16} />
      <span className="font-display text-xs leading-none text-chrome">
        {language}
      </span>
    </Subpanel>
  );
}

/* -------------------------------------------------------------------- screen */

/** Shared so the split and stacked HUD layouts cannot describe the bar differently. */
const XP_LABEL = `Experience bar: ${mlCount} of ${repos.length} public repositories are machine learning work, ${Math.round(mlShare * 100)} percent.`;

export function Hero({
  /**
   * Opens the inventory (screen 4a). Passed by the page, which owns that state.
   * Without it the button degrades to a plain link at the same address, so the
   * screen still works when rendered from a server component.
   */
  onOpenInventory,
}: {
  onOpenInventory?: () => void;
}) {
  const [line1, line2, line3] = site.heroWords;
  const languages = equippedLanguages();

  return (
    <section
      id="top"
      /**
       * 900px rather than the prototype's 720 canvas (800 before the quick-facts strip was added). The real body copy runs
       * four to five lines at 12px/1.9 where the placeholder ran two, which
       * pushes the hero block roughly 80px lower than the mock. 800 is the
       * floor at which the y112 hero, the bottom-132 HUD and the hotbar below
       * it all still clear each other. Taller viewports just get more dirt.
       */
      className="relative isolate flex h-[100svh] min-h-[900px] max-h-[960px] justify-center overflow-hidden"
    >
      <World />

      {/* The stage. Absolute coordinates below are design pixels measured from
          its top-left, which is why it carries no padding at the design width. */}
      <div className="relative flex w-full max-w-[1040px] flex-col gap-10 self-stretch px-5 pb-28 pt-24 stage:block stage:px-8 stage:pb-0 stage:pt-0">
        {/* ---------------------------------------------------------- hero */}
        <div className="flex max-w-[512px] flex-col gap-4 stage:absolute stage:left-8 stage:top-[112px] stage:w-[512px]">
          {site.availability && (
            <p
              className="flex w-fit items-center gap-2 font-display text-xs leading-none text-plate-text"
              style={{
                backgroundColor: "var(--plate-bg)",
                border: "4px solid var(--plate-border)",
                padding: "6px 10px",
              }}
            >
              <ItemChip color="var(--gold)" size={12} />
              {site.availability}
            </p>
          )}

          <h1 className="text-drop-lg font-display text-4xl uppercase leading-tight text-white sm:text-5xl">
            <span className="block">{line1}</span>
            <span className="block">{line2}</span>
            {/* The one gold line on the screen. */}
            <span className="block text-gold">{line3}</span>
          </h1>

          {/* Body plate. site.subheadline over site.bio.short: it names the
              three things the projects below are about (serving cost, agent
              pipelines, evaluation), which is what the item grid is showing. */}
          <p
            className="font-read text-base leading-relaxed"
            style={{
              maxWidth: 456,
              backgroundColor: "var(--plate-bg)",
              border: "4px solid var(--plate-border)",
              padding: "14px 16px",
              color: "var(--plate-text)",
            }}
          >
            {site.subheadline}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            {onOpenInventory ? (
              <PixelButton
                type="button"
                variant="primary"
                size="lg"
                onClick={onOpenInventory}
              >
                Open inventory
              </PixelButton>
            ) : (
              <PixelButtonLink href="/projects" variant="primary" size="lg">
                Open inventory
              </PixelButtonLink>
            )}

            <PixelButtonLink
              href={site.resumePath}
              variant="secondary"
              size="lg"
              external
            >
              Resume
            </PixelButtonLink>
          </div>

          {site.highlights.length > 0 && (
            <ul className="flex flex-wrap gap-1">
              {site.highlights.map((fact) => (
                <li
                  key={fact}
                  className="flex w-fit items-center gap-2 font-display text-xs leading-none text-plate-text"
                  style={{
                    backgroundColor: "var(--plate-bg)",
                    border: "4px solid var(--plate-border)",
                    padding: "4px 8px",
                  }}
                >
                  <ItemChip color="var(--gold)" size={12} />
                  {fact}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ------------------------------------------------ projects panel */}
        <Panel className="w-full max-w-[432px] p-3 stage:absolute stage:right-8 stage:top-[112px] stage:w-[432px]">
          <PanelHeading right={`${items.length} items`}>Projects</PanelHeading>

          <ul className="mt-2 grid grid-cols-5 gap-1 stage:grid-cols-[repeat(5,76px)] stage:justify-center">
            {items.map((item) => (
              <li key={item.slug} className={CELL}>
                <Link
                  href={`/projects/${item.slug}`}
                  className="block size-full"
                  aria-label={`${item.title} (${rarityLabel(item.rarity).toLowerCase()})`}
                >
                  <Slot
                    interactive
                    title={item.title}
                    className="grid size-full place-items-center"
                  >
                    <ItemChip
                      color={rarityColor(item.rarity)}
                      size={28}
                      bob={item.rarity === "legendary"}
                    />
                  </Slot>
                </Link>
              </li>
            ))}

            {/* Empty slots finish the two rows. No content, so nothing for a
                screen reader to read out. */}
            {Array.from({ length: emptySlots }, (_, i) => (
              <li key={`empty-${i}`} className={CELL}>
                <Slot className="size-full" />
              </li>
            ))}
          </ul>

          <div className="mt-3 flex gap-3">
            {/* Character render. Real pixel art is not supplied yet, so this is
                a placeholder chip in a 104x132 slot, per the handoff's Assets
                note. */}
            <Slot className="grid h-[132px] w-[104px] shrink-0 place-items-center">
              <ItemChip
                color="#6a6a6a"
                size={48}
                bob
                label="Character sprite, placeholder art"
              />
            </Slot>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <span className="emboss font-display text-xs uppercase text-chrome-soft">
                Equipped
              </span>
              <ul className="flex flex-col gap-1">
                {languages.map((language) => (
                  <EquippedRow key={language} language={language} />
                ))}
              </ul>
            </div>
          </div>
        </Panel>

        {/* ----------------------------------------------------------- HUD */}
        {/* Status dressing, so it is the first thing to go when the screen is
            too narrow to hold it without crowding the panel.

            The handoff splits these two: hearts and armor sit at x32, and the XP
            bar is centred on the stage. <Hud> stacks them, so at the design
            width they are placed separately and <Hud> is only used as the
            stacked fallback on narrower screens. */}
        {/* One bounded range, so nothing competes on source order: shown only
            between 640px and the stage width. */}
        <div className="hidden sm:max-stage:block">
          <Hud
            level={repos.length}
            progress={mlShare}
            xpLabel={XP_LABEL}
          />
        </div>

        <div className="absolute bottom-[132px] left-8 hidden flex-col gap-1 stage:flex">
          <Hearts />
          <Armor />
        </div>

        <XpBar
          className="absolute bottom-[116px] left-1/2 hidden -translate-x-1/2 stage:flex"
          level={repos.length}
          progress={mlShare}
          label={XP_LABEL}
        />
      </div>
    </section>
  );
}
