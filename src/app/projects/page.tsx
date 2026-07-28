import type { Metadata } from "next";

import { Panel, PanelHeading, Subpanel } from "@/components/pixel/panel";
import { PixelButtonLink } from "@/components/pixel/button";
import { World } from "@/components/pixel/world";
import { ProjectCard, ProjectRow } from "@/components/ui/project-card";
import { minorProjects, projectsByRecency, projectCategories } from "@/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description:
    "ML systems, LLM evaluation research, agent pipelines and applied ML, with the numbers that settle each one.",
  path: "/projects",
});

/**
 * The archive, as an inventory screen: the world paused behind a GUI, the
 * category counts as a stat rail, and every project as an item card.
 */
export default function ProjectsIndexPage() {
  const detailed = projectsByRecency.filter((p) => p.tier !== "minor");

  // Category counts, for the summary rail. Keeps the label list honest: a
  // category with nothing in it never renders.
  const counts = projectCategories
    .map((cat) => ({
      ...cat,
      count: detailed.filter((p) => p.category === cat.id).length,
    }))
    .filter((cat) => cat.count > 0);

  return (
    <div className="relative isolate">
      <World dimmed />

      <div className="container-wide pt-[calc(var(--header-h)+32px)] pb-16">
        {/* ------------------------------------------------------------ header */}
        <header className="flex flex-col gap-4">
          <p className="text-drop font-display text-xs uppercase tracking-wide text-white">
            Archive
          </p>

          <h1 className="text-drop-lg font-display text-3xl leading-tight text-white">
            Every project
          </h1>

          {/* Body plate, because 12px copy on open sky does not read. */}
          <div className="max-w-[560px] border-4 border-ring-black bg-plate p-4">
            <p className="font-display text-base leading-relaxed text-plate-text">
              Newest first. Each detail page opens with the problem, the
              approach, and the measurement that decides whether it worked.
            </p>
          </div>
        </header>

        {/* ------------------------------------------------------- counts rail */}
        {counts.length > 0 && (
          <Panel className="mt-8 p-3">
            <PanelHeading right={`${detailed.length} items`}>
              Categories
            </PanelHeading>

            <ul className="mt-3 flex flex-wrap gap-1">
              {counts.map((cat) => (
                <li key={cat.id}>
                  <Subpanel className="flex items-baseline gap-2 px-2 py-1.5">
                    <span className="emboss font-display text-2xs uppercase text-chrome-soft">
                      {cat.label}
                    </span>
                    <span
                      className="font-display text-xs text-chrome"
                      data-numeric
                    >
                      {cat.count}
                    </span>
                  </Subpanel>
                </li>
              ))}
            </ul>
          </Panel>
        )}

        {/* -------------------------------------------------------- item grid */}
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {detailed.map((project) => (
            <li key={project.slug} className="h-full">
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>

        {/* ----------------------------------------------------- earlier work */}
        {minorProjects.length > 0 && (
          <Panel className="mt-8 p-3">
            <PanelHeading right={`${minorProjects.length}`}>
              Earlier work
            </PanelHeading>
            <div className="mt-3">
              {minorProjects.map((project) => (
                <ProjectRow key={project.slug} project={project} />
              ))}
            </div>
          </Panel>
        )}

        <div className="mt-8">
          <PixelButtonLink href="/" variant="secondary" size="base">
            <span aria-hidden>{"<"}</span> Back to start
          </PixelButtonLink>
        </div>
      </div>
    </div>
  );
}
