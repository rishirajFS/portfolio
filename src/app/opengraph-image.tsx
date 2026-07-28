import { ImageResponse } from "next/og";

import { site } from "@/content";

export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated Open Graph card, in the pixel-GUI theme.
 *
 * Deliberately not token-driven: next/og renders in Satori, which supports
 * neither CSS custom properties nor oklch(), and has no support for
 * repeating-conic-gradient. So the world bands are painted as stacked divs and
 * the dither is approximated with a two-tone band, which is close enough at
 * social-card scale. Update these constants by hand if the theme moves.
 *
 * Silkscreen is not loaded here either: fetching a font at render time makes the
 * card slower and can fail. The card uses a system stack and leans on the layout
 * (bands, bevels, a hotbar) to read as a game screenshot.
 */
const SKY_1 = "#6d9dff";
const SKY_2 = "#8cb8ff";
const SKY_3 = "#a9cbff";
const GRASS = "#8ac249";
const GRASS_DARK = "#6f9f37";
const DIRT = "#8d6144";
const PANEL = "#c6c6c6";
const PANEL_LIGHT = "#ffffff";
const PANEL_DARK = "#565656";
const RING = "#1a1a1a";
const SLOT = "#8b8b8b";
const GOLD = "#ffcc33";
const PLATE = "rgba(20,20,20,.66)";

/** Raised bevel, matching .bevel-panel. */
const bevel = {
  borderTop: `4px solid ${PANEL_LIGHT}`,
  borderLeft: `4px solid ${PANEL_LIGHT}`,
  borderRight: `4px solid ${PANEL_DARK}`,
  borderBottom: `4px solid ${PANEL_DARK}`,
};

/** Inset bevel, matching .bevel-slot. */
const slotBevel = {
  backgroundColor: SLOT,
  borderTop: "3px solid #373737",
  borderLeft: "3px solid #373737",
  borderRight: "3px solid #ffffff",
  borderBottom: "3px solid #ffffff",
};

const HOTBAR_CHIPS = [
  "#4a8f2c", "#3572A5", "#c98a2e", "#8a4a9c",
  "#d8342a", "#2e9c9c", "#ffcc33", "#8b8b8b", "#8b8b8b",
];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          backgroundColor: DIRT,
          fontFamily: "monospace",
        }}
      >
        {/* World bands, top to bottom. */}
        <div style={{ display: "flex", height: 150, backgroundColor: SKY_1 }} />
        <div style={{ display: "flex", height: 40, backgroundColor: SKY_2, opacity: 0.6 }} />
        <div style={{ display: "flex", height: 110, backgroundColor: SKY_2 }} />
        <div style={{ display: "flex", height: 40, backgroundColor: SKY_3, opacity: 0.6 }} />
        <div style={{ display: "flex", height: 90, backgroundColor: SKY_3 }} />
        <div style={{ display: "flex", height: 18, backgroundColor: GRASS }} />
        <div style={{ display: "flex", height: 14, backgroundColor: GRASS_DARK }} />
        <div style={{ display: "flex", flex: 1, backgroundColor: DIRT }} />

        {/* Hard-edged clouds. */}
        <div style={{ position: "absolute", top: 54, left: 96, width: 150, height: 20, backgroundColor: "rgba(255,255,255,.7)" }} />
        <div style={{ position: "absolute", top: 74, left: 74, width: 196, height: 20, backgroundColor: "rgba(255,255,255,.7)" }} />
        <div style={{ position: "absolute", top: 40, left: 820, width: 130, height: 20, backgroundColor: "rgba(255,255,255,.55)" }} />
        <div style={{ position: "absolute", top: 60, left: 796, width: 180, height: 20, backgroundColor: "rgba(255,255,255,.55)" }} />

        {/* Top bar. */}
        <div
          style={{
            position: "absolute", top: 34, left: 40, width: 1120, height: 60,
            display: "flex", alignItems: "center", gap: 16, padding: "0 16px",
            backgroundColor: PANEL, boxShadow: `0 0 0 4px ${RING}`, ...bevel,
          }}
        >
          <div style={{ display: "flex", width: 30, height: 30, ...slotBevel }} />
          <span style={{ fontSize: 22, fontWeight: 700, color: "#2b2b2b", letterSpacing: 1 }}>
            rishiraj.dev
          </span>
          <div style={{ display: "flex", flex: 1 }} />
          <div
            style={{
              display: "flex", padding: "10px 18px", backgroundColor: "#4a8f2c",
              color: "#fff", fontSize: 15, fontWeight: 700,
              borderTop: "4px solid #7cc84c", borderLeft: "4px solid #7cc84c",
              borderRight: "4px solid #2c5d18", borderBottom: "4px solid #2c5d18",
              boxShadow: `0 0 0 4px ${RING}`,
            }}
          >
            CONTACT
          </div>
        </div>

        {/* Headline. */}
        <div
          style={{
            position: "absolute", top: 150, left: 44,
            display: "flex", flexDirection: "column", width: 640,
          }}
        >
          {["RISHI", "BUILDS"].map((word) => (
            <span
              key={word}
              style={{
                fontSize: 78, fontWeight: 700, lineHeight: 1.04, color: "#fff",
                letterSpacing: 2, textShadow: "5px 5px 0 #3a3a3a",
              }}
            >
              {word}
            </span>
          ))}
          <span
            style={{
              fontSize: 78, fontWeight: 700, lineHeight: 1.04, color: GOLD,
              letterSpacing: 2, textShadow: "5px 5px 0 #3a3a3a",
            }}
          >
            SYSTEMS
          </span>
        </div>

        {/* Body plate. */}
        <div
          style={{
            position: "absolute", top: 424, left: 44, width: 570,
            display: "flex", padding: "16px 18px",
            backgroundColor: PLATE, border: `4px solid ${RING}`,
          }}
        >
          <span style={{ fontSize: 17, lineHeight: 1.65, color: "#e8e8e8" }}>
            ML systems engineer at CMU. Cache eviction, agent pipelines, and
            evaluation honest enough to say no.
          </span>
        </div>

        {/* Projects panel. */}
        <div
          style={{
            position: "absolute", top: 118, right: 40, width: 400,
            display: "flex", flexDirection: "column", gap: 10, padding: 14,
            backgroundColor: PANEL, boxShadow: `0 0 0 4px ${RING}`, ...bevel,
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 700, color: "#3a3a3a", letterSpacing: 1 }}>
            PROJECTS
          </span>
          {[0, 1].map((row) => (
            <div key={row} style={{ display: "flex", gap: 6 }}>
              {[0, 1, 2, 3, 4].map((col) => {
                const chip = ["#ffcc33", "#a8a8ff", "#ffcc33", "#3572A5", "#8b8b8b"][col];
                const filled = row === 0 || col < 3;
                return (
                  <div
                    key={col}
                    style={{
                      display: "flex", width: 68, height: 68,
                      alignItems: "center", justifyContent: "center", ...slotBevel,
                    }}
                  >
                    {filled && (
                      <div style={{ display: "flex", width: 34, height: 34, backgroundColor: chip }} />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Hotbar. */}
        <div
          style={{
            position: "absolute", bottom: 34, left: 340,
            display: "flex", padding: 4,
            backgroundColor: PANEL, boxShadow: `0 0 0 4px ${RING}`, ...bevel,
          }}
        >
          {HOTBAR_CHIPS.map((chip, i) => (
            <div
              key={i}
              style={{
                display: "flex", width: 54, height: 54,
                alignItems: "center", justifyContent: "center", ...slotBevel,
                ...(i === 0 ? { outline: "4px solid #fff", outlineOffset: -1 } : {}),
              }}
            >
              {chip !== SLOT && (
                <div style={{ display: "flex", width: 28, height: 28, backgroundColor: chip }} />
              )}
            </div>
          ))}
        </div>

        {/* Hearts. */}
        <div style={{ position: "absolute", bottom: 116, left: 44, display: "flex", gap: 4 }}>
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              style={{
                display: "flex", width: 20, height: 18,
                backgroundColor: i < 7 ? "#d8342a" : "#4a2320",
                clipPath: "polygon(18% 0,50% 18%,82% 0,100% 32%,50% 100%,0 32%)",
              }}
            />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
