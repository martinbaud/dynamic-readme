/**
 * Minecraft crafting recipes
 * Pattern: 3x3 grid where null = empty slot
 */

export interface Recipe {
  pattern: (string | null)[][];
  result: string;
  count: number;
}

// Shapeless recipes match regardless of position
export interface ShapelessRecipe {
  ingredients: string[];
  result: string;
  count: number;
}

/**
 * Basic vanilla recipes
 * Pattern uses 3x3 grid, null = empty
 */
export const RECIPES: Recipe[] = [
  // === BASIC ===
  // Oak Log -> Oak Planks (1x1)
  {
    pattern: [
      ['oak_log', null, null],
      [null, null, null],
      [null, null, null]
    ],
    result: 'oak_planks',
    count: 4
  },
  // Planks -> Sticks (2x1 vertical)
  {
    pattern: [
      ['oak_planks', null, null],
      ['oak_planks', null, null],
      [null, null, null]
    ],
    result: 'stick',
    count: 4
  },
  // Crafting Table
  {
    pattern: [
      ['oak_planks', 'oak_planks', null],
      ['oak_planks', 'oak_planks', null],
      [null, null, null]
    ],
    result: 'crafting_table',
    count: 1
  },
  // Chest
  {
    pattern: [
      ['oak_planks', 'oak_planks', 'oak_planks'],
      ['oak_planks', null, 'oak_planks'],
      ['oak_planks', 'oak_planks', 'oak_planks']
    ],
    result: 'chest',
    count: 1
  },
  // Furnace
  {
    pattern: [
      ['cobblestone', 'cobblestone', 'cobblestone'],
      ['cobblestone', null, 'cobblestone'],
      ['cobblestone', 'cobblestone', 'cobblestone']
    ],
    result: 'furnace',
    count: 1
  },
  // Torch
  {
    pattern: [
      ['coal', null, null],
      ['stick', null, null],
      [null, null, null]
    ],
    result: 'torch',
    count: 4
  },
  // Ladder
  {
    pattern: [
      ['stick', null, 'stick'],
      ['stick', 'stick', 'stick'],
      ['stick', null, 'stick']
    ],
    result: 'ladder',
    count: 3
  },
  // === WOODEN TOOLS ===
  // Wooden Pickaxe
  {
    pattern: [
      ['oak_planks', 'oak_planks', 'oak_planks'],
      [null, 'stick', null],
      [null, 'stick', null]
    ],
    result: 'wooden_pickaxe',
    count: 1
  },
  // Wooden Axe
  {
    pattern: [
      ['oak_planks', 'oak_planks', null],
      ['oak_planks', 'stick', null],
      [null, 'stick', null]
    ],
    result: 'wooden_axe',
    count: 1
  },
  // Wooden Sword
  {
    pattern: [
      ['oak_planks', null, null],
      ['oak_planks', null, null],
      ['stick', null, null]
    ],
    result: 'wooden_sword',
    count: 1
  },
  // Wooden Shovel
  {
    pattern: [
      ['oak_planks', null, null],
      ['stick', null, null],
      ['stick', null, null]
    ],
    result: 'wooden_shovel',
    count: 1
  },
  // Wooden Hoe
  {
    pattern: [
      ['oak_planks', 'oak_planks', null],
      [null, 'stick', null],
      [null, 'stick', null]
    ],
    result: 'wooden_hoe',
    count: 1
  },
  // === STONE TOOLS ===
  // Stone Pickaxe
  {
    pattern: [
      ['cobblestone', 'cobblestone', 'cobblestone'],
      [null, 'stick', null],
      [null, 'stick', null]
    ],
    result: 'stone_pickaxe',
    count: 1
  },
  // Stone Axe
  {
    pattern: [
      ['cobblestone', 'cobblestone', null],
      ['cobblestone', 'stick', null],
      [null, 'stick', null]
    ],
    result: 'stone_axe',
    count: 1
  },
  // Stone Sword
  {
    pattern: [
      ['cobblestone', null, null],
      ['cobblestone', null, null],
      ['stick', null, null]
    ],
    result: 'stone_sword',
    count: 1
  },
  // Stone Shovel
  {
    pattern: [
      ['cobblestone', null, null],
      ['stick', null, null],
      ['stick', null, null]
    ],
    result: 'stone_shovel',
    count: 1
  },
  // Stone Hoe
  {
    pattern: [
      ['cobblestone', 'cobblestone', null],
      [null, 'stick', null],
      [null, 'stick', null]
    ],
    result: 'stone_hoe',
    count: 1
  },
  // === IRON TOOLS ===
  // Iron Pickaxe
  {
    pattern: [
      ['iron_ingot', 'iron_ingot', 'iron_ingot'],
      [null, 'stick', null],
      [null, 'stick', null]
    ],
    result: 'iron_pickaxe',
    count: 1
  },
  // Iron Sword
  {
    pattern: [
      ['iron_ingot', null, null],
      ['iron_ingot', null, null],
      ['stick', null, null]
    ],
    result: 'iron_sword',
    count: 1
  },
  // === DIAMOND TOOLS ===
  // Diamond Pickaxe
  {
    pattern: [
      ['diamond', 'diamond', 'diamond'],
      [null, 'stick', null],
      [null, 'stick', null]
    ],
    result: 'diamond_pickaxe',
    count: 1
  },
  // Diamond Sword
  {
    pattern: [
      ['diamond', null, null],
      ['diamond', null, null],
      ['stick', null, null]
    ],
    result: 'diamond_sword',
    count: 1
  },
  // === ARMOR ===
  // Iron Helmet
  {
    pattern: [
      ['iron_ingot', 'iron_ingot', 'iron_ingot'],
      ['iron_ingot', null, 'iron_ingot'],
      [null, null, null]
    ],
    result: 'iron_helmet',
    count: 1
  },
  // Iron Chestplate
  {
    pattern: [
      ['iron_ingot', null, 'iron_ingot'],
      ['iron_ingot', 'iron_ingot', 'iron_ingot'],
      ['iron_ingot', 'iron_ingot', 'iron_ingot']
    ],
    result: 'iron_chestplate',
    count: 1
  },
  // Iron Leggings
  {
    pattern: [
      ['iron_ingot', 'iron_ingot', 'iron_ingot'],
      ['iron_ingot', null, 'iron_ingot'],
      ['iron_ingot', null, 'iron_ingot']
    ],
    result: 'iron_leggings',
    count: 1
  },
  // Iron Boots
  {
    pattern: [
      ['iron_ingot', null, 'iron_ingot'],
      ['iron_ingot', null, 'iron_ingot'],
      [null, null, null]
    ],
    result: 'iron_boots',
    count: 1
  },
  // Diamond Helmet
  {
    pattern: [
      ['diamond', 'diamond', 'diamond'],
      ['diamond', null, 'diamond'],
      [null, null, null]
    ],
    result: 'diamond_helmet',
    count: 1
  },
  // Diamond Chestplate
  {
    pattern: [
      ['diamond', null, 'diamond'],
      ['diamond', 'diamond', 'diamond'],
      ['diamond', 'diamond', 'diamond']
    ],
    result: 'diamond_chestplate',
    count: 1
  },
  // Diamond Leggings
  {
    pattern: [
      ['diamond', 'diamond', 'diamond'],
      ['diamond', null, 'diamond'],
      ['diamond', null, 'diamond']
    ],
    result: 'diamond_leggings',
    count: 1
  },
  // Diamond Boots
  {
    pattern: [
      ['diamond', null, 'diamond'],
      ['diamond', null, 'diamond'],
      [null, null, null]
    ],
    result: 'diamond_boots',
    count: 1
  },
  // === MISC ===
  // Bow
  {
    pattern: [
      [null, 'stick', 'string'],
      ['stick', null, 'string'],
      [null, 'stick', 'string']
    ],
    result: 'bow',
    count: 1
  },
  // Arrow
  {
    pattern: [
      ['flint', null, null],
      ['stick', null, null],
      ['feather', null, null]
    ],
    result: 'arrow',
    count: 4
  },
  // Bucket
  {
    pattern: [
      ['iron_ingot', null, 'iron_ingot'],
      [null, 'iron_ingot', null],
      [null, null, null]
    ],
    result: 'bucket',
    count: 1
  },
  // Compass
  {
    pattern: [
      [null, 'iron_ingot', null],
      ['iron_ingot', 'redstone', 'iron_ingot'],
      [null, 'iron_ingot', null]
    ],
    result: 'compass',
    count: 1
  },
  // Clock
  {
    pattern: [
      [null, 'gold_ingot', null],
      ['gold_ingot', 'redstone', 'gold_ingot'],
      [null, 'gold_ingot', null]
    ],
    result: 'clock',
    count: 1
  },
  // Bed
  {
    pattern: [
      ['wool', 'wool', 'wool'],
      ['oak_planks', 'oak_planks', 'oak_planks'],
      [null, null, null]
    ],
    result: 'bed',
    count: 1
  },
  // Boat
  {
    pattern: [
      ['oak_planks', null, 'oak_planks'],
      ['oak_planks', 'oak_planks', 'oak_planks'],
      [null, null, null]
    ],
    result: 'boat',
    count: 1
  },
  // Minecart
  {
    pattern: [
      ['iron_ingot', null, 'iron_ingot'],
      ['iron_ingot', 'iron_ingot', 'iron_ingot'],
      [null, null, null]
    ],
    result: 'minecart',
    count: 1
  },
  // Rails
  {
    pattern: [
      ['iron_ingot', null, 'iron_ingot'],
      ['iron_ingot', 'stick', 'iron_ingot'],
      ['iron_ingot', null, 'iron_ingot']
    ],
    result: 'rail',
    count: 16
  },
  // Door
  {
    pattern: [
      ['oak_planks', 'oak_planks', null],
      ['oak_planks', 'oak_planks', null],
      ['oak_planks', 'oak_planks', null]
    ],
    result: 'oak_door',
    count: 3
  },
  // Fence
  {
    pattern: [
      ['oak_planks', 'stick', 'oak_planks'],
      ['oak_planks', 'stick', 'oak_planks'],
      [null, null, null]
    ],
    result: 'fence',
    count: 3
  },
  // Book
  {
    pattern: [
      ['paper', null, null],
      ['paper', null, null],
      ['leather', null, null]
    ],
    result: 'book',
    count: 1
  },
  // Paper
  {
    pattern: [
      ['sugar_cane', 'sugar_cane', 'sugar_cane'],
      [null, null, null],
      [null, null, null]
    ],
    result: 'paper',
    count: 3
  },
];

/**
 * Normalize pattern to handle offset recipes
 * E.g., log in center should still make planks
 */
export function normalizePattern(grid: (string | null)[][]): (string | null)[][] {
  // Find bounds of non-null items
  let minRow = 3, maxRow = -1, minCol = 3, maxCol = -1;

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (grid[r][c] !== null) {
        minRow = Math.min(minRow, r);
        maxRow = Math.max(maxRow, r);
        minCol = Math.min(minCol, c);
        maxCol = Math.max(maxCol, c);
      }
    }
  }

  if (maxRow === -1) return [[null, null, null], [null, null, null], [null, null, null]];

  // Shift to top-left
  const normalized: (string | null)[][] = [[null, null, null], [null, null, null], [null, null, null]];
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      normalized[r - minRow][c - minCol] = grid[r][c];
    }
  }

  return normalized;
}

/**
 * Find matching recipe for a grid
 */
export function findRecipe(grid: (string | null)[][]): Recipe | null {
  const normalized = normalizePattern(grid);

  for (const recipe of RECIPES) {
    const recipeNorm = normalizePattern(recipe.pattern);

    let matches = true;
    for (let r = 0; r < 3 && matches; r++) {
      for (let c = 0; c < 3 && matches; c++) {
        if (recipeNorm[r][c] !== normalized[r][c]) {
          matches = false;
        }
      }
    }

    if (matches) return recipe;
  }

  return null;
}
