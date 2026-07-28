import { PixelButtonLink } from "@/components/pixel/button";
import { Panel, PanelHeading, Subpanel } from "@/components/pixel/panel";
import { World } from "@/components/pixel/world";

/**
 * 404, as a game would put it: you walked off the edge of the map.
 */
export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[70svh] items-center py-24">
      <World dimmed />

      <div className="container-page flex justify-center">
        <Panel className="w-full max-w-[520px] p-5">
          <PanelHeading right="404">Chunk not found</PanelHeading>

          <h1 className="emboss mt-4 font-display text-md leading-normal text-chrome">
            There is nothing generated at this address.
          </h1>

          <Subpanel className="mt-4 p-3">
            <p className="font-display text-2xs leading-relaxed text-chrome-soft">
              The link may be out of date, or the page may have moved. Everything
              is reachable from the hotbar, or from the inventory.
            </p>
          </Subpanel>

          <div className="mt-5 flex flex-wrap gap-4">
            <PixelButtonLink href="/">Back to spawn</PixelButtonLink>
            <PixelButtonLink href="/inventory" variant="secondary">
              Open inventory
            </PixelButtonLink>
          </div>
        </Panel>
      </div>
    </section>
  );
}
