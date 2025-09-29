import Commander from "./commander.ts";
import Inventory from "./inventory.ts";
import LootProvider from "./loot_provider.ts";
import Matrix from "./matrix.ts";

const inventory = new Inventory();
const matrix = new Matrix().render();
new LootProvider(inventory, matrix).init();
new Commander(matrix).init();
