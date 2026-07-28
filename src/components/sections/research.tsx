import { Reveal } from "@/components/motion/motion-primitives";
import { PixelButtonLink } from "@/components/pixel/button";
import {
  Panel,
  PanelHeading,
  Subpanel,
  Tooltip,
} from "@/components/pixel/panel";
import { Section, SectionHeader } from "@/components/ui/section";
import { publications } from "@/content";

const STATUS_LABEL = {
  "in-preparation": "In preparation",
  "under-review": "Under review",
  published: "Published",
} as const;

/**
 * Publications. One prominent window per paper.
 *
 * The paper is unpublished, so the only links rendered are the ones in content
 * (`links` is empty on purpose). Nothing here invents a preprint or a code link.
 */
export function Research() {
  if (publications.length === 0) return null;

  return (
    <Section id="research">
      <SectionHeader
        eyebrow="Research"
        index="04"
        title="Publications"
        lede="Work at CMU's Language Technologies Institute on how conversational context erodes honest model judgment."
      />

      <div className="flex flex-col gap-6">
        {publications.map((paper) => (
          <Reveal key={paper.id}>
            <Panel as="article" className="p-5">
              <PanelHeading right={paper.year}>Publication</PanelHeading>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="bg-gold px-2 py-1 font-display text-2xs uppercase leading-none text-ring-black">
                  {STATUS_LABEL[paper.status]}
                </span>
                {paper.venue !== STATUS_LABEL[paper.status] && (
                  <span className="font-display text-2xs text-chrome-dim">
                    {paper.venue}
                  </span>
                )}
                {paper.advisor && (
                  <span className="font-display text-2xs text-chrome-dim">
                    Advised by {paper.advisor}
                  </span>
                )}
              </div>

              <h3 className="emboss mt-4 max-w-[56ch] font-display text-md leading-snug text-chrome">
                {paper.title}
              </h3>

              <Subpanel className="mt-4 flex flex-col gap-1 p-3">
                <span className="font-display text-2xs text-chrome">
                  {paper.authors.join(", ")}
                </span>
                {paper.affiliation && (
                  <span className="font-display text-2xs leading-normal text-chrome-dim">
                    {paper.affiliation}
                  </span>
                )}
              </Subpanel>

              {(paper.abstract || paper.findings.length > 0) && (
                <Tooltip solid className="mt-4 p-4">
                  {paper.abstract && (
                    <div className="prose-site">
                      <p>{paper.abstract}</p>
                    </div>
                  )}

                  {paper.findings.length > 0 && (
                    <>
                      {paper.abstract && (
                        <div
                          aria-hidden
                          className="my-4 h-1 bg-tooltip-border"
                        />
                      )}
                      <p className="font-display text-2xs uppercase tracking-wide text-gold">
                        What we found
                      </p>
                      <div className="prose-site mt-3">
                        <ul>
                          {paper.findings.map((finding) => (
                            <li key={finding}>{finding}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </Tooltip>
              )}

              {paper.links.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {paper.links.map((link) => (
                    <PixelButtonLink
                      key={link.href}
                      href={link.href}
                      variant="secondary"
                      external={link.external}
                    >
                      {link.label}
                    </PixelButtonLink>
                  ))}
                </div>
              )}
            </Panel>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
