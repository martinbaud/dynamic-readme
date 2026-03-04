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
  }
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
