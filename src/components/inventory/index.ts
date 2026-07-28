/**
 * Screen 4a, the inventory. Import from here, not from the files.
 *
 * InventoryScreen is the whole GUI and the only piece a page should need. The
 * three columns are exported for reuse and for isolated visual checks.
 */

export { InventoryScreen } from "./inventory-screen";
export { CharacterPanel } from "./character-panel";
export { RepoGrid } from "./repo-grid";
export type { HoveredRepo, CellRect } from "./repo-grid";
export { RepoDetail } from "./repo-detail";
