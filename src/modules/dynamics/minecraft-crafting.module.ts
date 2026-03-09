import { AbstractDynamicModule } from "../abstract.module";
import { Crafting, CraftingState } from "src/games/minecraft/classes/Crafting";
import { AppConfigService } from "src/services";

interface Data {
  uuid: string;
}

interface Options {
  showInventory?: boolean;
  maxInventoryDisplay?: number;
}

// Item sprite paths (served from /public/minecraft/items/)
const ITEM_SPRITES: Record<string, string> = {
  'oak_log': 'oak_log.svg',
  'oak_planks': 'oak_planks.svg',
  'stick': 'stick.svg',
  'wooden_pickaxe': 'wooden_pickaxe.svg',
  'crafting_table': 'crafting_table.svg',
  'chest': 'chest.svg',
  'empty': 'empty.svg'
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
    const { APP_BASE_URL } = AppConfigService;
    const sprite = item ? (ITEM_SPRITES[item] || 'empty.svg') : ITEM_SPRITES['empty'];
    return `<img src="${APP_BASE_URL}/minecraft/items/${sprite}" width="${size}" height="${size}" alt="${item || 'empty'}"/>`;
  }

  public async render(): Promise<string> {
    const { APP_BASE_URL } = AppConfigService;
    const BASE_URL = `${APP_BASE_URL}/minecraft/${this.data.uuid}`;

    const crafting = await this.getCrafting();
    const { grid, inventory, result, resultCount } = crafting;

    let str = `<h3 align="center">Minecraft Crafting</h3>\n`;
    str += `<div align="center">\n`;
    str += `<table>\n`;
    str += `<tr><th colspan="5">CRAFTING</th></tr>\n`;
    str += `<tr>\n`;

    // Crafting grid (3x3)
    str += `<td>\n<table>\n`;
    for (let row = 0; row < 3; row++) {
      str += `<tr>\n`;
      for (let col = 0; col < 3; col++) {
        const slot = row * 3 + col;
        const item = grid[slot];
        const img = this.getItemImg(item);

        if (item) {
          // Slot has item - click to remove
          str += `<td align="center" width="48" height="48" bgcolor="#8B5A2B">`;
          str += `<a href="${BASE_URL}/remove?slot=${slot}">${img}</a>`;
          str += `</td>\n`;
        } else {
          // Empty slot
          str += `<td align="center" width="48" height="48" bgcolor="#3d3d3d">`;
          str += `${img}`;
          str += `</td>\n`;
        }
      }
      str += `</tr>\n`;
    }
    str += `</table>\n</td>\n`;

    // Arrow
    str += `<td align="center" width="40">→</td>\n`;

    // Result slot
    if (result) {
      str += `<td align="center" width="64" height="48" bgcolor="#C4A060">`;
      str += `<a href="${BASE_URL}/craft">${this.getItemImg(result)}<br><b>x${resultCount}</b></a>`;
      str += `</td>\n`;
    } else {
      str += `<td align="center" width="64" height="48" bgcolor="#555555">`;
      str += `${this.getItemImg(null)}`;
      str += `</td>\n`;
    }

    str += `</tr>\n`;
    str += `</table>\n`;
    str += `</div>\n\n`;

    // Inventory
    if (this.options?.showInventory !== false) {
      const maxDisplay = this.options?.maxInventoryDisplay || 8;
      const displayItems = inventory.slice(0, maxDisplay);
      const remaining = inventory.length - maxDisplay;

      str += `<p align="center"><b>Inventory:</b> `;
      if (displayItems.length === 0) {
        str += `<i>empty</i>`;
      } else {
        for (const item of displayItems) {
          // Click to place in first empty slot
          const emptySlot = grid.findIndex(s => s === null);
          if (emptySlot !== -1) {
            str += `<a href="${BASE_URL}/place?slot=${emptySlot}&item=${item}">${this.getItemImg(item, 24)}</a> `;
          } else {
            str += `${this.getItemImg(item, 24)} `;
          }
        }
        if (remaining > 0) {
          str += `<i>+${remaining} more</i>`;
        }
      }
      str += `</p>\n`;
    }

    // Controls
    str += `<p align="center">`;
    str += `<a href="${BASE_URL}/clear">Clear</a> · `;
    str += `<a href="${BASE_URL}/reset">Reset</a>`;
    str += `</p>\n`;

    str += `<hr>\n\n`;

    return str;
  }
}
