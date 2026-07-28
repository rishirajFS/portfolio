/**
 * Single import surface for all site content.
 *
 * Pages and components import from "@/content", never from the individual
 * files, so content can be reorganized (or swapped for a CMS) without
 * touching a single component.
 */

export { site } from "./site";
export { experience } from "./experience";
export { education } from "./education";
export { skillGroups } from "./skills";
export { publications } from "./research";
export { courseworkClusters } from "./coursework";
export {
  repos,
  recentRepos,
  repoCategories,
  repoStats,
  reposIn,
  countIn,
  getRepo,
} from "./repos";
export type { RepoCategoryId } from "./repos";
export {
  projects,
  projectsByRecency,
  featuredProjects,
  secondaryProjects,
  minorProjects,
  detailedProjects,
  projectCategories,
  getProject,
} from "./projects";

export type {
  Site,
  Experience,
  Education,
  Project,
  ProjectTier,
  ProjectCategory,
  Publication,
  SkillGroup,
  CourseworkCluster,
  Repo,
  Rarity,
  Link,
  Metric,
} from "./schema";
