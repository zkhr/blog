import Commander from "./commander.ts";
import Inventory from "./inventory.ts";
import LootProvider from "./loot_provider.ts";
import Matrix from "./matrix.ts";

/**
 * The panels from the panels/ directory. These are included in JS as an
 * array of rendered html for the panels.
 */
declare const panels: string[];

const inventory = new Inventory();
const matrix = new Matrix(panels).render();
new LootProvider(inventory, matrix).init();
new Commander(matrix).init();
