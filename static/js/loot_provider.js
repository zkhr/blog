import { Minimap } from "./minimap.js";

/** Class applied to items the user already has. */
const OWNED_ITEM_CLASS = "owned-item";

/** Class applied to items the user does not have. */
const NEW_ITEM_CLASS = "new-item";

class LootProvider {
  /** Tracks the items that the user has found on the site. */
  #inventory;

  /** Provides information about the site grid. */
  #matrix;

  constructor(inventory, matrix) {
    this.#inventory = inventory;
    this.#matrix = matrix;
  }

  init() {
    const lootEls = document.querySelectorAll(".loot");
    for (const lootEl of lootEls) {
      const item = lootEl.dataset.loot;

      // Update the loot style, based on whether the user has the item.
      lootEl.classList.add(
        this.#inventory.hasItem(item) ? OWNED_ITEM_CLASS : NEW_ITEM_CLASS
      );

      // Make the loot selectable.
      lootEl.addEventListener("click", (evt) => {
        if (this.#inventory.hasItem(item)) {
          this.#showOwnedItemError(item);
        } else {
          this.#getItem(lootEl);
        }
      });

      // Trigger item effects for owned items.
      if (this.#inventory.hasItem(item)) {
        this.#triggerItemHook(item);
      }
    }

    return this;
  }

  #showOwnedItemError(item) {
    console.log("already own item", item);
  }

  #getItem(lootEl) {
    const item = lootEl.dataset.loot;
    this.#inventory.addItem(lootEl.dataset.loot);
    lootEl.classList.remove(NEW_ITEM_CLASS);
    lootEl.classList.add(OWNED_ITEM_CLASS);

    this.#triggerItemHook(item);
  }

  /* Trigger item effects based on owned loot. */
  #triggerItemHook(item) {
    switch (item) {
      case "map":
        new Minimap(this.#matrix).render();
        return;
    }
  }
}

export { LootProvider };
