import { Reveal } from "@/components/motion/motion-primitives";
import {
  Panel,
  PanelHeading,
  Slot,
  Subpanel,
  Tooltip,
} from "@/components/pixel/panel";
import { Section, SectionHeader } from "@/components/ui/section";
import { education, site } from "@/content";

/**
 * A coursework entry reads as an item in a bag: inset slot, pixel label.
 * Deliberately not a "tag", because nothing here is a pill.
 */
function CourseChip({ children }: { children: string }) {
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

export function About() {
  return (
    <Section id="about">
      <SectionHeader eyebrow="About" index="01" title="The short version" />

      <div className="grid gap-6 lg:grid-cols-12">
        <Reveal className="flex flex-col gap-6 lg:col-span-7">
          <Panel className="p-5">
            <PanelHeading right={site.role}>Player bio</PanelHeading>

            {/* The lead sentence stays in pixel type: it is short enough to
                carry the game voice without becoming a wall of Silkscreen. */}
            <Subpanel className="mt-4 p-3">
              <p className="font-display text-xs leading-relaxed text-chrome">
                {site.bio.short}
              </p>
            </Subpanel>

            {/* Several paragraphs of Silkscreen would be punishing, so the long
                bio drops onto the dark card in the reading face. */}
            <Tooltip solid className="mt-4 p-4">
              <div className="prose-site">
                <p>{site.bio.long}</p>
              </div>
            </Tooltip>
          </Panel>

          <Tooltip solid className="p-4">
            <div aria-hidden className="mb-3 h-1 w-16 bg-gold" />
            <p className="font-display text-2xs uppercase tracking-wide text-gold">
              The through line
            </p>
            <div className="prose-site mt-3">
              <p>{site.throughLine}</p>
            </div>
          </Tooltip>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-5">
          <Panel className="p-5">
            <PanelHeading right={`${education.length} entries`}>
              Education
            </PanelHeading>

            <ul className="mt-4 flex flex-col gap-3">
              {education.map((entry) => (
                <li key={entry.institution}>
                  <Subpanel className="flex flex-col gap-2 p-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="emboss font-display text-xs text-chrome">
                        {entry.institution}
                      </span>
                      <span
                        data-numeric
                        className="font-display text-2xs text-chrome-dim"
                      >
                        {entry.expected ? `Expected ${entry.end}` : entry.end}
                      </span>
                    </div>

                    <span className="font-display text-2xs leading-normal text-chrome-soft">
                      {entry.degree}
                    </span>
                    <span className="font-display text-2xs text-chrome-dim">
                      {entry.location}
                    </span>

                    {entry.coursework.length > 0 && (
                      <ul className="mt-1 flex flex-wrap gap-1">
                        {entry.coursework.map((course) => (
                          <li key={course}>
                            <CourseChip>{course}</CourseChip>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Subpanel>
                </li>
              ))}
            </ul>
          </Panel>
        </Reveal>
      </div>
    </Section>
  );
}
