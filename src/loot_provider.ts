import Inventory from "./inventory.ts";
import Matrix from "./matrix.ts";
import Minimap from "./minimap.ts";

/** Class applied to items the user already has. */
const OWNED_ITEM_CLASS = "owned-item";

/** Class applied to items the user does not have. */
const NEW_ITEM_CLASS = "new-item";

export default class LootProvider {
  /** Tracks the items that the user has found on the site. */
  private inventory: Inventory;

  /** Provides information about the site grid. */
  private matrix: Matrix;

  constructor(inventory: Inventory, matrix: Matrix) {
    this.inventory = inventory;
    this.matrix = matrix;
  }

  init() {
    for (const panelMetadata of this.matrix.panelMetadataMap.values()) {
      const panel = panelMetadata.panelEl;
      const lootEls = panel.querySelectorAll<HTMLElement>(".loot");
      for (const lootEl of lootEls) {
        const item = lootEl.dataset.loot;

        // Update the loot style, based on whether the user has the item.
        lootEl.classList.add(
          this.inventory.hasItem(item) ? OWNED_ITEM_CLASS : NEW_ITEM_CLASS,
        );

        // Make the loot selectable.
        lootEl.addEventListener("click", () => {
          if (this.inventory.hasItem(item)) {
            this.showOwnedItemError(item);
          } else {
            this.getItem(lootEl);
          }
        });

        // Trigger item effects for owned items.
        if (this.inventory.hasItem(item)) {
          this.triggerItemHook(item);
        }
      }
    }

    return this;
  }

  private showOwnedItemError(item: string) {
    console.log("already own item", item);
  }

  private getItem(lootEl: HTMLElement) {
    const item = lootEl.dataset.loot;
    this.inventory.addItem(lootEl.dataset.loot);
    lootEl.classList.remove(NEW_ITEM_CLASS);
    lootEl.classList.add(OWNED_ITEM_CLASS);

    this.triggerItemHook(item);
  }

  /* Trigger item effects based on owned loot. */
  private triggerItemHook(item: string) {
    switch (item) {
      case "map":
        new Minimap(this.matrix).render();
        return;
    }
  }
}
