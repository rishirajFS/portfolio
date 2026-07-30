import { Reveal, Stagger, StaggerItem } from "@/components/motion/motion-primitives";
import { PixelButtonLink } from "@/components/pixel/button";
import { PanelHeading, Subpanel } from "@/components/pixel/panel";
import {
  FeaturedProjectCard,
  ProjectCard,
  ProjectRow,
} from "@/components/ui/project-card";
import { Section, SectionHeader } from "@/components/ui/section";
import { featuredProjects, minorProjects, secondaryProjects } from "@/content";

/**
 * The projects section: the written work, laid out as loot.
 *
 * This is the long-form counterpart to the inventory. The inventory browses all
 * 25 repositories at a glance; this reads the four that have a write-up behind
 * them. Both are reachable from the hotbar, which is why the section header
 * points at the inventory rather than duplicating its grid.
 */
export function Projects() {
  return (
    <Section id="projects">
      <SectionHeader
        eyebrow="Selected work"
        index="03"
        title="Projects"
        action={
          <PixelButtonLink href="/inventory" variant="nav" size="base">
            Open inventory
          </PixelButtonLink>
        }
      />

      {/* Featured: the legendary drops, one full panel pair each. */}
      <div className="flex flex-col gap-8">
        {featuredProjects.map((project, i) => (
          <Reveal key={project.slug} amount={0.15}>
            <FeaturedProjectCard project={project} index={i} />
          </Reveal>
        ))}
      </div>

      {secondaryProjects.length > 0 && (
        <div className="mt-10">
          <Reveal>
            <PanelHeading
              className="mb-4"
              right={`${secondaryProjects.length} items`}
            >
              Also shipped
            </PanelHeading>
          </Reveal>

          <Stagger stagger={0.06} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {secondaryProjects.map((project) => (
              <StaggerItem key={project.slug} className="h-full">
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      )}

      {minorProjects.length > 0 && (
        <Reveal className="mt-10">
          <PanelHeading className="mb-4" right={`${minorProjects.length} items`}>
            Earlier
          </PanelHeading>
          <Subpanel className="flex flex-col gap-2 p-3">
            {minorProjects.map((project) => (
              <ProjectRow key={project.slug} project={project} />
            ))}
          </Subpanel>
        </Reveal>
      )}
    </Section>
  );
}
