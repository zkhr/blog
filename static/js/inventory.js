/** The key for the inventory tracked in local storage. */
const INVENTORY_KEY = "inventory";

/**
 * The delimiter between items in the local storage representation of the
 * inventory.
 */
const INVENTORY_DELIMETER = "|";

/**
 * Tracks the items that the user has found on the site. This is mirrored in
 * local storage so items persist on page refresh.
 */
class Inventory {
  /** Set containing the user's items. */
  #bag;

  constructor() {
    this.#bag = this.#fetchCachedInventory();
  }

  /** Fetches the user's inventory from local storage. */
  #fetchCachedInventory() {
    const bag = new Set();

    const cachedInventory = localStorage.getItem(INVENTORY_KEY);
    if (cachedInventory !== null) {
      for (const item of cachedInventory.split(INVENTORY_DELIMETER)) {
        bag.add(item);
      }
    }

    return bag;
  }

  /** Updates the cached representation of the inventory. */
  #updateCachedInventory() {
    const stringifiedInventory = this.listItems().join(INVENTORY_DELIMETER);
    localStorage.setItem(INVENTORY_KEY, stringifiedInventory);
  }

  addItem(item) {
    this.#bag.add(item);
    this.#updateCachedInventory();
  }

  hasItem(item) {
    return this.#bag.has(item);
  }

  listItems() {
    return [...this.#bag.values()];
  }

  removeItem(item) {
    this.#bag.delete(item);
    this.#updateCachedInventory();
  }
}

export { Inventory };
