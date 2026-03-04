import { findRecipe, Recipe } from './Recipe';

/**
 * Minecraft crafting table state
 */
export interface CraftingState {
  grid: (string | null)[];      // 9 slots (3x3 flattened)
  inventory: string[];           // Available items
  result: string | null;         // Current craft result
  resultCount: number;           // How many items the recipe produces
  history: CraftEvent[];         // Craft history
}

export interface CraftEvent {
  timestamp: number;
  action: 'place' | 'craft' | 'clear';
  item?: string;
  slot?: number;
  result?: string;
}

export class Crafting {
  grid: (string | null)[];
  inventory: string[];
  result: string | null;
  resultCount: number;
  history: CraftEvent[];

  constructor(data?: Partial<CraftingState>) {
    this.grid = data?.grid ?? Array(9).fill(null);
    this.inventory = data?.inventory ?? ['oak_log', 'oak_log', 'oak_log', 'oak_log'];
    this.result = data?.result ?? null;
    this.resultCount = data?.resultCount ?? 0;
    this.history = data?.history ?? [];
  }

  /**
   * Convert flat grid to 3x3 matrix
   */
  private toMatrix(): (string | null)[][] {
    return [
      [this.grid[0], this.grid[1], this.grid[2]],
      [this.grid[3], this.grid[4], this.grid[5]],
      [this.grid[6], this.grid[7], this.grid[8]]
    ];
  }

  /**
   * Place an item from inventory into a grid slot
   */
  place(slot: number, item: string): boolean {
    if (slot < 0 || slot > 8) return false;
    if (this.grid[slot] !== null) return false;

    const itemIndex = this.inventory.indexOf(item);
    if (itemIndex === -1) return false;

    // Remove from inventory, place in grid
    this.inventory.splice(itemIndex, 1);
    this.grid[slot] = item;

    // Check for recipe match
    this.updateResult();

    this.history.push({
      timestamp: Date.now(),
      action: 'place',
      item,
      slot
    });

    return true;
  }

  /**
   * Remove item from slot, return to inventory
   */
  remove(slot: number): boolean {
    if (slot < 0 || slot > 8) return false;
    if (this.grid[slot] === null) return false;

    const item = this.grid[slot];
    this.inventory.push(item);
    this.grid[slot] = null;

    this.updateResult();
    return true;
  }

  /**
   * Update craft result based on current grid
   */
  private updateResult(): void {
    const recipe = findRecipe(this.toMatrix());
    if (recipe) {
      this.result = recipe.result;
      this.resultCount = recipe.count;
    } else {
      this.result = null;
      this.resultCount = 0;
    }
  }

  /**
   * Execute craft: consume grid items, add result to inventory
   */
  craft(): boolean {
    if (!this.result) return false;

    const result = this.result;
    const count = this.resultCount;

    // Clear grid
    this.grid = Array(9).fill(null);

    // Add result to inventory
    for (let i = 0; i < count; i++) {
      this.inventory.push(result);
    }

    this.history.push({
      timestamp: Date.now(),
      action: 'craft',
      result,
    });

    this.result = null;
    this.resultCount = 0;

    return true;
  }

  /**
   * Clear grid, return items to inventory
   */
  clear(): void {
    for (const item of this.grid) {
      if (item !== null) {
        this.inventory.push(item);
      }
    }
    this.grid = Array(9).fill(null);
    this.result = null;
    this.resultCount = 0;

    this.history.push({
      timestamp: Date.now(),
      action: 'clear'
    });
  }

  /**
   * Reset to initial state
   */
  reset(): void {
    this.grid = Array(9).fill(null);
    this.inventory = ['oak_log', 'oak_log', 'oak_log', 'oak_log'];
    this.result = null;
    this.resultCount = 0;
    this.history = [];
  }

  /**
   * Serialize state for Redis
   */
  toJSON(): CraftingState {
    return {
      grid: this.grid,
      inventory: this.inventory,
      result: this.result,
      resultCount: this.resultCount,
      history: this.history
    };
  }
}
