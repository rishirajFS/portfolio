/**
 * Language colours, from GitHub linguist.
 *
 * Kept as literal hex rather than CSS vars because these are also used inline
 * for chip fills and stacked bars, where a var() would not survive being
 * interpolated into a gradient string.
 */
const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3572A5",
  Java: "#b07219",
  HTML: "#e34c26",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  C: "#555555",
  "C++": "#f34b7d",
  Cuda: "#3a4e3a",
  Cython: "#fedf5b",
  CMake: "#da3434",
  Dockerfile: "#384d54",
  Shell: "#89e051",
  Ruby: "#701516",
  HCL: "#844fba",
  Mustache: "#724b3b",
  PLpgSQL: "#336790",
  "Jupyter Notebook": "#da5b0b",
};

export const UNKNOWN_LANGUAGE_COLOR = "#6a6a6a";

export function languageColor(language: string | null | undefined): string {
  if (!language) return UNKNOWN_LANGUAGE_COLOR;
  return LANGUAGE_COLORS[language] ?? UNKNOWN_LANGUAGE_COLOR;
}

/** Rarity frame colour for an inventory item. */
export function rarityColor(rarity: "legendary" | "rare" | "common"): string {
  return { legendary: "#ffcc33", rare: "#a8a8ff", common: "#d8d8d8" }[rarity];
}

/** The word a game would put on the item card. */
export function rarityLabel(
  rarity: "legendary" | "rare" | "common",
): string {
  return { legendary: "Legendary item", rare: "Rare item", common: "Common item" }[
    rarity
  ];
}
