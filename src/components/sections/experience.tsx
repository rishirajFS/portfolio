import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/motion/motion-primitives";
import { Panel, Slot, Subpanel, Tooltip } from "@/components/pixel/panel";
import { Section, SectionHeader } from "@/components/ui/section";
import { experience } from "@/content";
import { dateRange } from "@/lib/format";

/** A stack tag, sitting in the panel the way an item sits in a slot. */
function TagSlot({ children }: { children: string }) {
  return (
    <Slot className="px-2 py-1">
      <span
        className="font-display text-2xs leading-none text-[#f2f2f2]"
        style={{ textShadow: "1px 1px 0 #3a3a3a" }}
      >
        {children}
      </span>
    </Slot>
  );
}

/**
 * The advancements log. Each role is its own GUI window: chrome for the facts,
 * the dark card for the bullets, and a gold bar plus a gold plate on whatever
 * is still in progress, the way a game marks the active quest.
 */
export function Experience() {
  return (
    <Section id="experience">
      <SectionHeader
        eyebrow="Experience"
        index="02"
        title="Where I've worked"
      />

      <Stagger stagger={0.08} className="flex flex-col gap-6">
        {experience.map((role) => (
          <StaggerItem key={role.id}>
            <Panel as="article" className="p-5">
              {role.current && <div aria-hidden className="mb-4 h-1 bg-gold" />}

              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                <h3 className="emboss font-display text-base text-chrome">
                  {role.org}
                </h3>

                <div className="flex flex-wrap items-center gap-2">
                  {role.current && (
                    <span className="inline-flex items-center gap-2 bg-gold px-2 py-1 font-display text-2xs uppercase leading-none text-ring-black">
                      <span aria-hidden className="block size-1 bg-ring-black" />
                      Current
                    </span>
                  )}
                  <time
                    data-numeric
                    className="font-display text-2xs text-chrome-dim"
                  >
                    {dateRange(role.start, role.end)}
                  </time>
                </div>
              </div>

              {role.orgNote && (
                <p className="mt-2 font-display text-2xs text-chrome-dim">
                  {role.orgNote}
                </p>
              )}

              <Subpanel className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 p-3">
                <span className="font-display text-xs text-chrome">
                  {role.role}
                </span>
                {role.location && (
                  <span className="font-display text-2xs text-chrome-dim">
                    {role.location}
                  </span>
                )}
              </Subpanel>

              {role.blurb && (
                <p className="mt-4 font-display text-2xs leading-relaxed text-chrome-soft">
                  {role.blurb}
                </p>
              )}

              {/* Bullets carry the numbers, so they go on the dark card in the
                  reading face. The square gold markers come from .prose-site. */}
              <Tooltip solid className="mt-4 p-4">
                <div className="prose-site">
                  <ul>
                    {role.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </Tooltip>

              {role.tags.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-1">
                  {role.tags.map((tag) => (
                    <li key={tag}>
                      <TagSlot>{tag}</TagSlot>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="mt-6">
        <Subpanel className="px-4 py-3">
          <p className="font-display text-2xs leading-normal text-chrome-soft">
            Full history and coursework detail lives in the résumé.
          </p>
        </Subpanel>
      </Reveal>
    </Section>
  );
}
