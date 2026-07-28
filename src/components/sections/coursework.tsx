import { Reveal } from "@/components/motion/motion-primitives";
import { PixelButtonLink } from "@/components/pixel/button";
import { Panel, PanelHeading, Tooltip } from "@/components/pixel/panel";
import { Section, SectionHeader } from "@/components/ui/section";
import { courseworkClusters } from "@/content";
import { languageColor } from "@/lib/languages";

/**
 * Coursework with public implementations, as collapsed GUI rows. Still a
 * <details>, so it works with no JavaScript and stays keyboard operable; the
 * marker is a pixel [+] / [-] rather than a rotating chevron.
 *
 * Supporting evidence, not headline work, so it stays one quiet window.
 */
export function Coursework() {
  if (courseworkClusters.length === 0) return null;

  return (
    <Section id="coursework" size="sm">
      <SectionHeader
        eyebrow="Coursework"
        index="06"
        title="Graduate implementations"
        lede="Assignments with public code, grouped by course."
      />

      <Reveal>
        <Panel className="p-4">
          <PanelHeading right={`${courseworkClusters.length} courses`}>
            Course log
          </PanelHeading>

          <div className="mt-4 flex flex-col gap-2">
            {courseworkClusters.map((cluster) => (
              <details key={cluster.id} className="group">
                <summary
                  className={[
                    "bevel-subpanel flex cursor-pointer list-none flex-wrap items-baseline gap-x-3 gap-y-1 px-3 py-2",
                    "duration-fast transition-[filter] hover:brightness-110",
                    "marker:hidden [&::-webkit-details-marker]:hidden",
                  ].join(" ")}
                >
                  <span
                    aria-hidden
                    className="font-display text-2xs text-chrome-dim"
                  >
                    <span className="group-open:hidden">[+]</span>
                    <span className="hidden group-open:inline">[-]</span>
                  </span>

                  <span className="flex-1 font-display text-xs leading-normal text-chrome">
                    {cluster.name}
                    {cluster.course && (
                      <span className="ml-2 text-2xs text-chrome-dim">
                        {cluster.course}
                      </span>
                    )}
                  </span>

                  <span
                    data-numeric
                    className="flex-none font-display text-2xs text-chrome-dim"
                  >
                    {cluster.repos.length} repo
                    {cluster.repos.length === 1 ? "" : "s"}
                    {cluster.language && ` · ${cluster.language}`}
                  </span>
                </summary>

                <Tooltip solid className="mt-1 p-4">
                  <div className="prose-site">
                    <p>{cluster.description}</p>
                  </div>

                  {cluster.repos.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {cluster.repos.map((repo) => (
                        <li key={repo.href}>
                          <PixelButtonLink
                            href={repo.href}
                            variant="secondary"
                            size="sm"
                            chip={languageColor(cluster.language)}
                            external
                          >
                            {repo.name}
                          </PixelButtonLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </Tooltip>
              </details>
            ))}
          </div>
        </Panel>
      </Reveal>
    </Section>
  );
}
