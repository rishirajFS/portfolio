import { Stagger, StaggerItem } from "@/components/motion/motion-primitives";
import { ItemChip, Panel, PanelHeading, Slot } from "@/components/pixel/panel";
import { Section, SectionHeader } from "@/components/ui/section";
import { skillGroups } from "@/content";
import { UNKNOWN_LANGUAGE_COLOR, languageColor } from "@/lib/languages";

/**
 * A few skill labels differ from GitHub's linguist name for the same language.
 * Bridging them here keeps a chip in this grid the same colour as that language
 * in the inventory, which is the whole point of reusing languageColor.
 */
const LANGUAGE_ALIAS: Record<string, string> = {
  CUDA: "Cuda",
  "CUDA kernels": "Cuda",
  SQL: "PLpgSQL",
  Docker: "Dockerfile",
};

/**
 * Tools that are not languages take their group's tone, so each panel reads as
 * one set of equipment. Values are from the handoff's palette.
 */
const GROUP_TONES = [
  "#3572A5",
  "#3f6ea8",
  "#a8a8ff",
  "#4a8f2c",
  "#c98a2e",
  "#384d54",
];

function chipColor(skill: string, groupIndex: number): string {
  const named = languageColor(LANGUAGE_ALIAS[skill] ?? skill);
  return named === UNKNOWN_LANGUAGE_COLOR
    ? GROUP_TONES[groupIndex % GROUP_TONES.length]
    : named;
}

/** The equipment screen: one window per group, one slot per item. */
export function Skills() {
  return (
    <Section id="skills">
      <SectionHeader
        eyebrow="Stack"
        index="05"
        title="What I work with"
        lede="Ordered by depth rather than alphabetically. The things nearer the front are the ones with shipped code behind them."
      />

      <Stagger
        stagger={0.06}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {skillGroups.map((group, groupIndex) => (
          <StaggerItem key={group.name} className="h-full">
            <Panel className="flex h-full flex-col p-4">
              <PanelHeading right={`${group.skills.length}`}>
                {group.name}
              </PanelHeading>

              {group.note && (
                <p className="mt-2 font-display text-2xs leading-normal text-chrome-dim">
                  {group.note}
                </p>
              )}

              <ul className="mt-4 flex flex-col gap-1">
                {group.skills.map((skill) => (
                  <li key={skill}>
                    <Slot className="flex min-h-8 items-center gap-2 px-2 py-1">
                      <ItemChip color={chipColor(skill, groupIndex)} size={16} />
                      <span
                        className="font-display text-2xs leading-normal text-[#f2f2f2]"
                        style={{ textShadow: "1px 1px 0 #3a3a3a" }}
                      >
                        {skill}
                      </span>
                    </Slot>
                  </li>
                ))}
              </ul>
            </Panel>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
