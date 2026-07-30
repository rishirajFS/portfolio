import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { PixelButtonLink } from "@/components/pixel/button";
import {
  ItemChip,
  Panel,
  PanelHeading,
  Slot,
  Tooltip,
  TooltipMuted,
  TooltipTitle,
} from "@/components/pixel/panel";
import { World } from "@/components/pixel/world";
import { ItemFrame, StatRow } from "@/components/ui/project-card";
import { detailedProjects, getProject, type Project } from "@/content";
import { cn } from "@/lib/cn";
import { compactNumber, dateRange, monthYear } from "@/lib/format";
import { getRepoStats } from "@/lib/github";
import { languageColor } from "@/lib/languages";
import { pageMetadata } from "@/lib/seo";

/** Static params for every project that gets a detail page. */
export function generateStaticParams() {
  return detailedProjects.map((p) => ({ slug: p.slug }));
}

// Revalidate hourly so live GitHub stats stay reasonably current.
export const revalidate = 3600;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return pageMetadata({ title: "Not found", noIndex: true });

  return pageMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${project.slug}`,
    image: project.image,
    type: "article",
  });
}

const STATUS_LABEL: Record<Project["status"], string> = {
  active: "Active",
  "in-progress": "In progress",
  "in-review": "Under review",
  shipped: "Shipped",
  archived: "Archived",
};

/**
 * An inset dark screen: the readable surface inside a GUI panel.
 *
 * Long-form copy cannot sit on the #c6c6c6 panel face, because `.prose-site`
 * is light-on-dark by design (12px Silkscreen for six paragraphs is the thing
 * it exists to avoid). So the panel keeps the chrome and this holds the words,
 * bevelled inward like every other hole in the interface.
 */
function Screen({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("border-[3px] p-4 sm:p-5", className)}
      style={{
        backgroundColor: "var(--panel-ring)",
        borderColor: "#000000 #4a4a4a #4a4a4a #000000",
      }}
    >
      {children}
    </div>
  );
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);

  // Minor-tier projects deliberately have no detail page.
  if (!project || project.tier === "minor") notFound();

  const stats = project.repo ? await getRepoStats(project.repo) : null;

  const index = detailedProjects.findIndex((p) => p.slug === project.slug);
  const next = detailedProjects[(index + 1) % detailedProjects.length];

  const showCaveats =
    Boolean(project.caveats) && process.env.NODE_ENV !== "production";

  return (
    <article className="relative isolate">
      <World dimmed />

      <div className="container-page pt-[calc(var(--header-h)+32px)] pb-16">
        {/* ------------------------------------------------------------ header */}
        <PixelButtonLink href="/projects" variant="nav" size="sm">
          <span aria-hidden>{"<"}</span> All projects
        </PixelButtonLink>

        <header className="mt-6 flex flex-col gap-4">
          <h1 className="text-drop-lg font-display text-3xl leading-tight text-white">
            {project.title}
          </h1>

          {/* Body plate: the item card. Context line and dates, nothing else;
              the paragraph gets its own readout below. */}
          <div className="max-w-[640px] border-4 border-ring-black bg-plate p-4">
            <p className="font-display text-xs leading-relaxed text-plate-text">
              {project.kind}
              <span aria-hidden className="mx-1.5">
                ·
              </span>
              {dateRange(project.start, project.end)}
              <span aria-hidden className="mx-1.5">
                ·
              </span>
              <span className="text-gold">{STATUS_LABEL[project.status]}</span>
            </p>
          </div>

          {/* Empty on purpose for the unpublished paper, so nothing renders. */}
          {project.links.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {project.links.map((link, i) => (
                <PixelButtonLink
                  key={link.href}
                  href={link.href}
                  external={link.external}
                  variant={i === 0 ? "primary" : "secondary"}
                  size="base"
                >
                  {link.label}
                </PixelButtonLink>
              ))}
            </div>
          )}
        </header>

        <div className="mt-8 grid gap-4 lg:grid-cols-12">
          {/* ------------------------------------------------------- main column */}
          <div className="flex flex-col gap-4 lg:col-span-8">
            {/* Stats */}
            {project.metrics.length > 0 && (
              <Panel className="p-4">
                <PanelHeading right={`${project.metrics.length} recorded`}>
                  Stats
                </PanelHeading>
                <div className="mt-3 grid gap-1 sm:grid-cols-2">
                  {project.metrics.map((metric) => (
                    <StatRow key={metric.label} metric={metric} />
                  ))}
                </div>
              </Panel>
            )}

            {/* The one paragraph. Capped at 55 words in content, so there is
                nothing here to sub-divide into problem/approach/architecture. */}
            <Panel className="p-4">
              <PanelHeading right="Log">Write-up</PanelHeading>
              <Screen className="mt-3">
                <p className="prose-site">{project.description}</p>
              </Screen>
            </Panel>

            {/* The one technical detail worth stopping on. Tooltip treatment,
                because this is the item description, not chrome. */}
            {project.note && (
              <Tooltip solid className="p-4">
                <p className="font-display text-xs uppercase tracking-wide text-tooltip-meta">
                  The interesting part
                </p>
                <div className="prose-site mt-3">
                  <p>{project.note}</p>
                </div>
              </Tooltip>
            )}

            {/* Highlights. prose-site already draws square gold bullets. */}
          </div>

          {/* ---------------------------------------------------------- sidebar */}
          <aside className="lg:col-span-4">
            <Panel className="flex flex-col gap-4 p-4 lg:sticky lg:top-[calc(var(--header-h)+16px)]">
              {/* Stack, as equipped items. */}
              <div>
                <PanelHeading right={`${project.stack.length}`}>
                  Stack
                </PanelHeading>
                <ul className="mt-3 flex flex-col gap-1">
                  {project.stack.map((item) => (
                    <li key={item}>
                      <Slot className="flex h-8 items-center gap-2 px-2">
                        <ItemChip color={languageColor(item)} size={12} />
                        <span
                          className="font-display text-2xs leading-none"
                          style={{
                            color: "#f2f2f2",
                            textShadow: "1px 1px 0 #3a3a3a",
                          }}
                        >
                          {item}
                        </span>
                      </Slot>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Live repo card. Absent whenever the project has no repo, which
                  is how the unpublished paper stays unlinked. */}
              {stats && (
                <div>
                  <PanelHeading>Repository</PanelHeading>
                  <Link
                    href={stats.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-3 block"
                  >
                    <Tooltip
                      solid
                      className="flex flex-col gap-2 p-3 break-words"
                    >
                      <TooltipTitle>{stats.fullName}</TooltipTitle>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        {stats.language && (
                          <span className="flex items-center gap-1.5">
                            <ItemChip
                              color={languageColor(stats.language)}
                              size={10}
                            />
                            <span className="font-display text-xs text-tooltip-meta">
                              {stats.language}
                            </span>
                          </span>
                        )}
                        {stats.stars > 0 && (
                          <span
                            className="font-display text-xs text-gold"
                            data-numeric
                          >
                            {compactNumber(stats.stars)} stars
                          </span>
                        )}
                      </div>

                      <TooltipMuted>
                        Updated {monthYear(stats.pushedAt)}
                      </TooltipMuted>

                      <span className="font-display text-2xs uppercase text-tooltip-meta group-hover:text-tooltip-title">
                        Open on GitHub <span aria-hidden>{">"}</span>
                        <span className="sr-only">(opens in a new tab)</span>
                      </span>
                    </Tooltip>
                  </Link>
                </div>
              )}

              {/* Dev-only: surfaces unverified claims while content is in flux. */}
              {showCaveats && (
                <div
                  className="border-[3px] p-3"
                  style={{
                    backgroundColor: "var(--tooltip-bg-solid)",
                    borderColor: "var(--gold)",
                  }}
                >
                  <p className="font-display text-2xs uppercase text-gold">
                    Content note (dev only)
                  </p>
                  <p className="mt-2 font-read text-base leading-normal text-common">
                    {project.caveats}
                  </p>
                </div>
              )}
            </Panel>
          </aside>
        </div>

        {/* --------------------------------------------------------------- next */}
        <Link href={`/projects/${next.slug}`} className="group mt-8 block">
          <Panel className="flex items-center gap-3 p-4 group-hover:brightness-105">
            <ItemFrame project={next} size={48} />
            <div className="flex min-w-0 flex-col gap-1">
              <span className="emboss font-display text-2xs uppercase text-chrome-dim">
                Next project
              </span>
              <span className="emboss font-display text-base leading-snug text-chrome">
                {next.title}
              </span>
              <span className="font-display text-2xs leading-normal text-chrome-soft">
                {next.kind}
              </span>
            </div>
            <span
              aria-hidden
              className="ml-auto shrink-0 font-display text-md text-chrome-soft"
            >
              {">"}
            </span>
          </Panel>
        </Link>
      </div>
    </article>
  );
}
