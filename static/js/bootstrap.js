import { Commander } from "./commander.js";
import { Inventory } from "./inventory.js";
import { LootProvider } from "./loot_provider.js";
import { Loader } from "./loader.js";
import { Matrix } from "./matrix.js";

const inventory = new Inventory();
const matrix = new Matrix().render();

/**
 * Initializes various components of the blog. We store references in
 * window.debug to aid in debugging and development of new features. Code
 * shouldn't use window.debug directly (to avoid circular deps).
 */
window.debug = {
  inventory,
  matrix,
  loot: new LootProvider(inventory, matrix).init(),
  loader: new Loader(matrix).init(),
  commander: new Commander(matrix).init(),
};
