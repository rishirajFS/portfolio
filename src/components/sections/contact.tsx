import { Reveal } from "@/components/motion/motion-primitives";
import { PixelButtonLink } from "@/components/pixel/button";
import { Panel, Slot, Subpanel } from "@/components/pixel/panel";
import { GroundStrip } from "@/components/pixel/world";
import { Section } from "@/components/ui/section";
import { site } from "@/content";

/** Small text sitting in an inset slot: light label, hard 1px shadow. */
const SLOT_TEXT = { textShadow: "1px 1px 0 #3a3a3a" } as const;

/**
 * The last window on the screen. A fresh strip of ground first, so the page
 * ends in the same world it started in rather than on a stack of cards.
 */
export function Contact() {
  const socials = site.socials.filter((social) => social.external);

  return (
    <Section id="contact" size="lg" container="none">
      <GroundStrip className="mb-12" />

      <div className="container-page">
        <Reveal className="flex justify-center">
          <Panel className="w-full max-w-[560px] p-5 text-center">
            <span className="bevel-subpanel emboss inline-block px-2 py-1 font-display text-2xs uppercase tracking-wide text-chrome-soft">
              Contact
            </span>

            <h2 className="emboss mx-auto mt-4 max-w-[44ch] font-display text-md leading-normal text-chrome">
              If any of this is the kind of problem you&rsquo;re working on,
              I&rsquo;d like to hear about it.
            </h2>

            {site.availability && (
              <Subpanel className="mt-4 p-3">
                <p className="font-display text-2xs leading-normal text-chrome-soft">
                  {site.availability}.
                </p>
              </Subpanel>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <PixelButtonLink
                href={`mailto:${site.email}`}
                size="lg"
                chip="var(--gold)"
                // The address is long. Let it wrap on a narrow screen rather
                // than push a horizontal scrollbar onto the page.
                className="max-w-full break-words whitespace-normal"
              >
                {site.email}
              </PixelButtonLink>
              <PixelButtonLink
                href={site.resumePath}
                variant="secondary"
                size="lg"
                chip="var(--armor-full)"
              >
                Résumé
              </PixelButtonLink>
            </div>

            <Slot className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-3">
              {site.phone && (
                <span
                  data-numeric
                  className="font-display text-2xs text-[#f2f2f2]"
                  style={SLOT_TEXT}
                >
                  {site.phone}
                </span>
              )}
              <span
                className="font-display text-2xs text-[#f2f2f2]"
                style={SLOT_TEXT}
              >
                {site.location}
              </span>
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="duration-fast font-display text-2xs text-[#f2f2f2] underline transition-colors hover:text-gold"
                  style={SLOT_TEXT}
                >
                  {social.label}
                </a>
              ))}
            </Slot>
          </Panel>
        </Reveal>
      </div>
    </Section>
  );
}
