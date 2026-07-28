import { cn } from "@/lib/cn";

/**
 * The voxel world behind the GUI.
 *
 * Painted as a stack of horizontal bands, top to bottom, with 8px dither bands
 * standing in for every gradient. Heights are the design-pixel values from the
 * handoff; the dirt band flexes to fill whatever is left, so the same stack
 * works at 720px and at 1400px.
 *
 * The dither is the whole texture device. A smooth sky gradient is the single
 * change that would make this read as a website with a blue background rather
 * than a game world, so the checker stays even though it is more code.
 */

/** One tiled cloud layer, as hard-edged rectangles on 16px multiples. */
function cloudTile(opacity: number) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='480' height='160'>
    <g fill='#ffffff' fill-opacity='${opacity}'>
      <rect x='32' y='48' width='96' height='16'/>
      <rect x='16' y='64' width='144' height='16'/>
      <rect x='48' y='32' width='64' height='16'/>
      <rect x='240' y='96' width='128' height='16'/>
      <rect x='224' y='112' width='160' height='16'/>
      <rect x='272' y='80' width='64' height='16'/>
      <rect x='384' y='32' width='80' height='16'/>
      <rect x='368' y='48' width='112' height='16'/>
    </g>
  </svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function Clouds({ className }: { className?: string }) {
  return (
    <>
      {/* Two layers at different speeds and opacities read as depth without
          needing a parallax scroll listener. */}
      <div
        aria-hidden
        className={cn("pointer-events-none absolute inset-x-0 top-0 h-[272px]", className)}
        style={{
          backgroundImage: cloudTile(0.72),
          backgroundRepeat: "repeat-x",
          backgroundPosition: "0 16px",
          animation: "cloud-drift var(--drift-duration) linear infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[272px]"
        style={{
          backgroundImage: cloudTile(0.4),
          backgroundRepeat: "repeat-x",
          backgroundPosition: "120px 64px",
          animation:
            "cloud-drift calc(var(--drift-duration) * 1.9) linear infinite",
        }}
      />
    </>
  );
}

/** A dither band: an 8px checkerboard of two adjacent tones. */
function Dither({
  light,
  dark,
  height,
}: {
  light: string;
  dark: string;
  height: number;
}) {
  return (
    <div
      className="dither w-full shrink-0"
      style={
        {
          height,
          "--dither-light": light,
          "--dither-dark": dark,
        } as React.CSSProperties
      }
    />
  );
}

/**
 * Full world backdrop. Absolutely positioned, so a section just needs
 * `relative` and this fills it.
 *
 * `dimmed` applies the scrim used when the inventory GUI is open: the world is
 * still there, just paused behind the interface.
 */
export function World({
  className,
  dimmed = false,
  clouds = true,
}: {
  className?: string;
  dimmed?: boolean;
  clouds?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 flex flex-col overflow-hidden",
        className,
      )}
    >
      {/* Sky, stepping down through two dither bands. */}
      <div
        className="relative w-full shrink-0"
        style={{ height: 112, backgroundColor: "var(--sky-1)" }}
      >
        {clouds && <Clouds />}
      </div>
      <Dither light="var(--sky-2)" dark="var(--sky-1)" height={32} />
      <div
        className="w-full shrink-0"
        style={{ height: 96, backgroundColor: "var(--sky-2)" }}
      />
      <Dither light="var(--sky-3)" dark="var(--sky-2)" height={32} />
      <div
        className="w-full shrink-0"
        style={{ height: 96, backgroundColor: "var(--sky-3)" }}
      />

      {/* Grass: a solid cap, then a dither into the darker tone. */}
      <div
        className="w-full shrink-0"
        style={{ height: 16, backgroundColor: "var(--grass-light)" }}
      />
      <Dither light="var(--grass-light)" dark="var(--grass-dark)" height={16} />

      {/* Dirt fills the remainder, with a block grid and a vignette so the
          bottom of the screen falls away instead of ending flat. */}
      <div
        className="block-grid relative min-h-[160px] w-full flex-1"
        style={{ backgroundColor: "var(--dirt)" }}
      >
        <div
          className="dither absolute inset-0 opacity-30"
          style={
            {
              "--dither-light": "rgba(255,255,255,.10)",
              "--dither-dark": "rgba(0,0,0,.10)",
            } as React.CSSProperties
          }
        />
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: "70%",
            backgroundImage:
              "linear-gradient(to bottom, transparent, rgba(0,0,0,.45))",
          }}
        />
      </div>

      {dimmed && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "var(--scrim)" }}
        />
      )}
    </div>
  );
}

/**
 * Just the scrim, for overlaying the inventory on top of an existing world
 * without painting a second band stack.
 */
export function WorldScrim({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("absolute inset-0", className)}
      style={{
        backgroundColor: "var(--scrim)",
        animation: "scrim-in var(--dur-fast) var(--ease-out)",
      }}
    />
  );
}

/**
 * A short strip of world, for section dividers further down the page: grass
 * line into dirt, no sky. Keeps the scroll feeling like one continuous world
 * rather than a hero followed by a normal website.
 */
export function GroundStrip({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("w-full overflow-hidden", className)}>
      <div style={{ height: 8, backgroundColor: "var(--grass-light)" }} />
      <div
        className="dither"
        style={
          {
            height: 12,
            "--dither-light": "var(--grass-light)",
            "--dither-dark": "var(--grass-dark)",
          } as React.CSSProperties
        }
      />
      <div
        className="block-grid"
        style={{ height: 28, backgroundColor: "var(--dirt)" }}
      />
    </div>
  );
}
