import { AbstractDynamicModule } from "../abstract.module";
import { Crafting, CraftingState } from "src/games/minecraft/classes/Crafting";
import { AppConfigService } from "src/services";

interface Data {
  uuid: string;
}

interface Options {
  showInventory?: boolean;
  maxInventoryDisplay?: number;
  headerIcon?: string;
}

// Minecraft Wiki sprite URLs (32x32 PNG)
const WIKI_BASE = 'https://minecraft.wiki/images';
const ITEM_SPRITES: Record<string, string> = {
  // Basic resources
  'oak_log': `${WIKI_BASE}/Invicon_Oak_Log.png`,
  'oak_planks': `${WIKI_BASE}/Invicon_Oak_Planks.png`,
  'stick': `${WIKI_BASE}/Invicon_Stick.png`,
  'cobblestone': `${WIKI_BASE}/Invicon_Cobblestone.png`,
  'coal': `${WIKI_BASE}/Invicon_Coal.png`,
  'iron_ingot': `${WIKI_BASE}/Invicon_Iron_Ingot.png`,
  'gold_ingot': `${WIKI_BASE}/Invicon_Gold_Ingot.png`,
  'diamond': `${WIKI_BASE}/Invicon_Diamond.png`,
  'redstone': `${WIKI_BASE}/Invicon_Redstone_Dust.png`,
  'string': `${WIKI_BASE}/Invicon_String.png`,
  'feather': `${WIKI_BASE}/Invicon_Feather.png`,
  'flint': `${WIKI_BASE}/Invicon_Flint.png`,
  'leather': `${WIKI_BASE}/Invicon_Leather.png`,
  'paper': `${WIKI_BASE}/Invicon_Paper.png`,
  'wool': `${WIKI_BASE}/Invicon_White_Wool.png`,
  'sugar_cane': `${WIKI_BASE}/Invicon_Sugar_Cane.png`,
  // Basic crafted
  'crafting_table': `${WIKI_BASE}/Invicon_Crafting_Table.png`,
  'chest': `${WIKI_BASE}/Invicon_Chest.png`,
  'furnace': `${WIKI_BASE}/Invicon_Furnace.png`,
  'torch': `${WIKI_BASE}/Invicon_Torch.png`,
  'ladder': `${WIKI_BASE}/Invicon_Ladder.png`,
  // Wooden tools
  'wooden_pickaxe': `${WIKI_BASE}/Invicon_Wooden_Pickaxe.png`,
  'wooden_axe': `${WIKI_BASE}/Invicon_Wooden_Axe.png`,
  'wooden_sword': `${WIKI_BASE}/Invicon_Wooden_Sword.png`,
  'wooden_shovel': `${WIKI_BASE}/Invicon_Wooden_Shovel.png`,
  'wooden_hoe': `${WIKI_BASE}/Invicon_Wooden_Hoe.png`,
  // Stone tools
  'stone_pickaxe': `${WIKI_BASE}/Invicon_Stone_Pickaxe.png`,
  'stone_axe': `${WIKI_BASE}/Invicon_Stone_Axe.png`,
  'stone_sword': `${WIKI_BASE}/Invicon_Stone_Sword.png`,
  'stone_shovel': `${WIKI_BASE}/Invicon_Stone_Shovel.png`,
  'stone_hoe': `${WIKI_BASE}/Invicon_Stone_Hoe.png`,
  // Iron tools
  'iron_pickaxe': `${WIKI_BASE}/Invicon_Iron_Pickaxe.png`,
  'iron_axe': `${WIKI_BASE}/Invicon_Iron_Axe.png`,
  'iron_sword': `${WIKI_BASE}/Invicon_Iron_Sword.png`,
  'iron_shovel': `${WIKI_BASE}/Invicon_Iron_Shovel.png`,
  'iron_hoe': `${WIKI_BASE}/Invicon_Iron_Hoe.png`,
  // Diamond tools
  'diamond_pickaxe': `${WIKI_BASE}/Invicon_Diamond_Pickaxe.png`,
  'diamond_axe': `${WIKI_BASE}/Invicon_Diamond_Axe.png`,
  'diamond_sword': `${WIKI_BASE}/Invicon_Diamond_Sword.png`,
  'diamond_shovel': `${WIKI_BASE}/Invicon_Diamond_Shovel.png`,
  'diamond_hoe': `${WIKI_BASE}/Invicon_Diamond_Hoe.png`,
  // Iron armor
  'iron_helmet': `${WIKI_BASE}/Invicon_Iron_Helmet.png`,
  'iron_chestplate': `${WIKI_BASE}/Invicon_Iron_Chestplate.png`,
  'iron_leggings': `${WIKI_BASE}/Invicon_Iron_Leggings.png`,
  'iron_boots': `${WIKI_BASE}/Invicon_Iron_Boots.png`,
  // Diamond armor
  'diamond_helmet': `${WIKI_BASE}/Invicon_Diamond_Helmet.png`,
  'diamond_chestplate': `${WIKI_BASE}/Invicon_Diamond_Chestplate.png`,
  'diamond_leggings': `${WIKI_BASE}/Invicon_Diamond_Leggings.png`,
  'diamond_boots': `${WIKI_BASE}/Invicon_Diamond_Boots.png`,
  // Misc items
  'bow': `${WIKI_BASE}/Invicon_Bow.png`,
  'arrow': `${WIKI_BASE}/Invicon_Arrow.png`,
  'bucket': `${WIKI_BASE}/Invicon_Bucket.png`,
  'compass': `${WIKI_BASE}/Invicon_Compass.png`,
  'clock': `${WIKI_BASE}/Invicon_Clock.png`,
  'bed': `${WIKI_BASE}/Invicon_Red_Bed.png`,
  'boat': `${WIKI_BASE}/Invicon_Oak_Boat.png`,
  'minecart': `${WIKI_BASE}/Invicon_Minecart.png`,
  'rail': `${WIKI_BASE}/Invicon_Rail.png`,
  'oak_door': `${WIKI_BASE}/Invicon_Oak_Door.png`,
  'fence': `${WIKI_BASE}/Invicon_Oak_Fence.png`,
  'book': `${WIKI_BASE}/Invicon_Book.png`,
};


export class MinecraftCraftingDynamicModule extends AbstractDynamicModule<Data, Options> {
  redisKey: string;

  async init() {
    this.redisKey = `mc:${this.data.uuid}`;
    if (!await AppConfigService.redis.client.get(this.redisKey)) {
      await this.reset();
    }
  }

  async getCrafting(): Promise<Crafting> {
    const data = await AppConfigService.redis.client.get(this.redisKey);
    if (!data) return new Crafting();
    return new Crafting(JSON.parse(data));
  }

  async saveCrafting(crafting: Crafting): Promise<void> {
    await AppConfigService.redis.client.set(this.redisKey, JSON.stringify(crafting.toJSON()));
    this.needsRender = true;
  }

  async reset(): Promise<Crafting> {
    const crafting = new Crafting();
    await this.saveCrafting(crafting);
    return crafting;
  }

  async place(slot: number, item: string): Promise<boolean> {
    const crafting = await this.getCrafting();
    const success = crafting.place(slot, item);
    if (success) {
      await this.saveCrafting(crafting);
    }
    return success;
  }

  async remove(slot: number): Promise<boolean> {
    const crafting = await this.getCrafting();
    const success = crafting.remove(slot);
    if (success) {
      await this.saveCrafting(crafting);
    }
    return success;
  }

  async craft(): Promise<boolean> {
    const crafting = await this.getCrafting();
    const success = crafting.craft();
    if (success) {
      await this.saveCrafting(crafting);
    }
    return success;
  }

  async clear(): Promise<void> {
    const crafting = await this.getCrafting();
    crafting.clear();
    await this.saveCrafting(crafting);
  }

  private getItemImg(item: string | null, size: number = 32): string {
    if (!item) return '';
    const sprite = ITEM_SPRITES[item];
    if (!sprite) {
      // Fallback: text label
      const label = item.replace(/_/g, ' ').substring(0, 3);
      return `<code title="${item}">${label}</code>`;
    }
    // Force square aspect ratio
    return `<img src="${sprite}" width="${size}" height="${size}" style="min-width:${size}px;min-height:${size}px;max-width:${size}px;max-height:${size}px;aspect-ratio:1/1;object-fit:contain;" alt="${item}" title="${item.replace(/_/g, ' ')}">`;
  }

  public async render(): Promise<string> {
    const { APP_BASE_URL } = AppConfigService;
    const BASE_URL = `${APP_BASE_URL}/minecraft/${this.data.uuid}`;

    const crafting = await this.getCrafting();
    const { grid, inventory, result, resultCount } = crafting;

    // Minecraft-style inventory background
    const MC_BG = '#c6c6c6';
    const MC_SLOT = '#8b8b8b';
    const MC_SLOT_DARK = '#373737';
    const MC_SLOT_LIGHT = '#ffffff';

    let str = `<div align="center">\n`;

    // Main crafting UI container with Minecraft inventory style
    str += `<table cellpadding="8" cellspacing="0" style="background:${MC_BG};border:3px solid ${MC_SLOT_DARK};border-radius:4px;">\n`;
    const headerIcon = this.options?.headerIcon
      ? `<img src="${this.options.headerIcon}" width="32" height="32" style="image-rendering:pixelated;">`
      : '⛏️ CRAFTING TABLE';
    str += `<tr><td colspan="5" align="center">${headerIcon}</td></tr>\n`;
    str += `<tr>\n`;

    // Crafting grid (3x3) with Minecraft slot styling
    str += `<td valign="middle">\n<table cellpadding="0" cellspacing="2" style="background:${MC_BG};">\n`;
    for (let row = 0; row < 3; row++) {
      str += `<tr>\n`;
      for (let col = 0; col < 3; col++) {
        const slot = row * 3 + col;
        const item = grid[slot];
        const img = this.getItemImg(item);

        // Minecraft-style slot with 3D border effect
        const slotStyle = `background:${MC_SLOT};border:2px solid;border-color:${MC_SLOT_DARK} ${MC_SLOT_LIGHT} ${MC_SLOT_LIGHT} ${MC_SLOT_DARK};`;

        if (item) {
          str += `<td align="center" width="40" height="40" style="${slotStyle}">`;
          str += `<a href="${BASE_URL}/remove?slot=${slot}">${img}</a>`;
          str += `</td>\n`;
        } else {
          str += `<td align="center" width="40" height="40" style="${slotStyle}">`;
          str += `</td>\n`;
        }
      }
      str += `</tr>\n`;
    }
    str += `</table>\n</td>\n`;

    // Result slot (larger, golden border for craftable item)
    const resultSlotStyle = result
      ? `background:#8b8b8b;border:3px solid;border-color:${MC_SLOT_DARK} #d4af37 #d4af37 ${MC_SLOT_DARK};`
      : `background:${MC_SLOT};border:2px solid;border-color:${MC_SLOT_DARK} ${MC_SLOT_LIGHT} ${MC_SLOT_LIGHT} ${MC_SLOT_DARK};`;

    str += `<td align="center" width="48" height="48" style="${resultSlotStyle}">`;
    if (result) {
      str += `<a href="${BASE_URL}/craft">${this.getItemImg(result)}</a>`;
      if (resultCount > 1) {
        str += `<br><span style="color:#404040;font-size:12px;font-weight:bold;">x${resultCount}</span>`;
      }
    }
    str += `</td>\n`;

    str += `</tr>\n`;
    str += `</table>\n`;
    str += `</div>\n\n`;

    // Inventory with slot selector grid
    if (this.options?.showInventory !== false) {
      // Count items by type
      const itemCounts = new Map<string, number>();
      for (const item of inventory) {
        itemCounts.set(item, (itemCounts.get(item) || 0) + 1);
      }

      // Find empty slots
      const emptySlots = grid.map((s, i) => s === null ? i : -1).filter(i => i !== -1);

      // Helper to render an item row
      const renderItemRow = (item: string, count: number) => {
        let row = `<tr>`;
        row += `<td align="center" style="width:40px;height:40px;min-width:40px;" bgcolor="${MC_SLOT}">${this.getItemImg(item, 32)}</td>`;
        row += `<td align="center" width="32"><b>x${count}</b></td>`;

        // Slot buttons 1-9
        for (let s = 0; s < 9; s++) {
          const isEmpty = emptySlots.includes(s);
          if (isEmpty) {
            row += `<td align="center" width="18"><a href="${BASE_URL}/place?slot=${s}&item=${item}"><b>${s + 1}</b></a></td>`;
          } else {
            row += `<td align="center" width="18" style="color:#999;">${s + 1}</td>`;
          }
        }
        row += `</tr>\n`;
        return row;
      };

      const items = Array.from(itemCounts.entries());
      const maxVisible = 4;

      str += `<div align="center">\n`;
      str += `<table>\n`;
      str += `<tr>\n`;

      // Left: Inventory items
      str += `<td valign="top">\n`;
      str += `<table>\n`;

      if (items.length === 0) {
        str += `<tr><td><i>empty</i></td></tr>`;
      } else {
        // Show first items directly
        for (let i = 0; i < Math.min(items.length, maxVisible); i++) {
          str += renderItemRow(items[i][0], items[i][1]);
        }

        // Remaining items in collapsible
        if (items.length > maxVisible) {
          str += `<tr><td colspan="11">\n`;
          str += `<details><summary>+${items.length - maxVisible} more items</summary>\n`;
          str += `<table>\n`;
          for (let i = maxVisible; i < items.length; i++) {
            str += renderItemRow(items[i][0], items[i][1]);
          }
          str += `</table>\n`;
          str += `</details>\n`;
          str += `</td></tr>\n`;
        }
      }
      str += `</table>\n`;
      str += `</td>\n`;

      // Right: Slot reference (3x3 numbered grid)
      str += `<td valign="top" width="60">\n`;
      str += `<table cellpadding="4">\n`;
      for (let row = 0; row < 3; row++) {
        str += `<tr>`;
        for (let col = 0; col < 3; col++) {
          const slot = row * 3 + col;
          const isEmpty = emptySlots.includes(slot);
          const bg = isEmpty ? '#5a5' : '#555';
          str += `<td align="center" bgcolor="${bg}"><b>${slot + 1}</b></td>`;
        }
        str += `</tr>\n`;
      }
      str += `</table>\n`;
      str += `</td>\n`;

      str += `</tr>\n`;
      str += `</table>\n`;
      str += `</div>\n\n`;
    }

    // Controls with Minecraft button style
    str += `<p align="center" style="margin-top:8px;">`;
    str += `<a href="${BASE_URL}/clear" style="color:#404040;">🗑️ Clear</a>`;
    str += ` · `;
    str += `<a href="${BASE_URL}/reset" style="color:#404040;">🔄 Reset</a>`;
    str += `</p>\n`;

    str += `\n---\n\n`;

    return str;
  }
}
