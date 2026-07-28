import { PixelButtonLink } from "@/components/pixel/button";
import { Panel } from "@/components/pixel/panel";
import { repoStats, site } from "@/content";

/**
 * The footer is chrome, not a section: one panel strip with the sync note, the
 * social links as nav buttons, and the copyright. Everything it says is derived
 * from content, so the repo count and the GitHub handle cannot go stale.
 *
 * The bottom padding clears the hotbar, which is fixed to the bottom of the
 * viewport and would otherwise cover this strip at the end of the page.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  const github = site.socials.find((s) => s.icon === "github");
  const githubHandle = github?.href.replace(/^https?:\/\//, "");

  return (
    <footer className="mt-auto pb-28 pt-12">
      <div className="container-page">
        <Panel className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 p-3">
          {githubHandle && (
            <p className="emboss font-display text-2xs leading-relaxed text-chrome-soft">
              {repoStats.repos} repos synced from {githubHandle}
            </p>
          )}

          <nav aria-label="Elsewhere" className="flex flex-wrap gap-2">
            {site.socials.map((social) => (
              <PixelButtonLink
                key={social.label}
                href={social.href}
                external={social.external}
                variant="nav"
                size="sm"
              >
                {social.label}
              </PixelButtonLink>
            ))}
          </nav>

          <p className="font-display text-2xs leading-relaxed text-chrome-dim">
            © {year} {site.name} · {site.location}
          </p>
        </Panel>
      </div>
    </footer>
  );
}
