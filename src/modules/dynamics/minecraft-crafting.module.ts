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

// Minecraft Wiki sprite URLs (32x32 PNG)
const WIKI_BASE = 'https://minecraft.wiki/images';
const ITEM_SPRITES: Record<string, string> = {
  // Basic
  'oak_log': `${WIKI_BASE}/Invicon_Oak_Log.png`,
  'oak_planks': `${WIKI_BASE}/Invicon_Oak_Planks.png`,
  'stick': `${WIKI_BASE}/Invicon_Stick.png`,
  'crafting_table': `${WIKI_BASE}/Invicon_Crafting_Table.png`,
  'chest': `${WIKI_BASE}/Invicon_Chest.png`,
  'furnace': `${WIKI_BASE}/Invicon_Furnace.png`,
  'torch': `${WIKI_BASE}/Invicon_Torch.png`,
  'ladder': `${WIKI_BASE}/Invicon_Ladder.png`,
  'cobblestone': `${WIKI_BASE}/Invicon_Cobblestone.png`,
  'coal': `${WIKI_BASE}/Invicon_Coal.png`,
  'iron_ingot': `${WIKI_BASE}/Invicon_Iron_Ingot.png`,
  'diamond': `${WIKI_BASE}/Invicon_Diamond.png`,
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
  'iron_sword': `${WIKI_BASE}/Invicon_Iron_Sword.png`,
  // Diamond tools
  'diamond_pickaxe': `${WIKI_BASE}/Invicon_Diamond_Pickaxe.png`,
  'diamond_sword': `${WIKI_BASE}/Invicon_Diamond_Sword.png`,
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
    if (!sprite) return `<span title="${item}">❓</span>`;
    return `<img src="${sprite}" width="${size}" height="${size}" alt="${item}" title="${item.replace(/_/g, ' ')}"/>`;
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
    str += `<tr><td colspan="5" align="center" style="color:#404040;font-weight:bold;font-family:monospace;">⛏️ CRAFTING TABLE</td></tr>\n`;
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

    // Arrow with Minecraft style
    str += `<td align="center" width="50" style="font-size:24px;color:#404040;">➡️</td>\n`;

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

      str += `<div align="center">\n`;
      str += `<table cellpadding="2" cellspacing="0">\n`;
      str += `<tr>\n`;

      // Left: Inventory items (vertical list)
      str += `<td valign="top">\n`;
      str += `<table cellpadding="2" cellspacing="1" style="background:${MC_BG};border:2px solid ${MC_SLOT_DARK};">\n`;

      if (itemCounts.size === 0) {
        str += `<tr><td style="color:#606060;padding:4px;"><i>empty</i></td></tr>`;
      } else {
        for (const [item, count] of itemCounts) {
          const slotStyle = `background:${MC_SLOT};border:1px solid ${MC_SLOT_DARK};`;
          str += `<tr>`;
          str += `<td style="${slotStyle}" align="center" width="28" height="28">${this.getItemImg(item, 20)}</td>`;
          str += `<td style="color:#404040;font-size:10px;padding:0 4px;"><b>x${count}</b></td>`;

          // Slot buttons 1-9
          for (let s = 0; s < 9; s++) {
            const isEmpty = emptySlots.includes(s);
            if (isEmpty) {
              str += `<td><a href="${BASE_URL}/place?slot=${s}&item=${item}" style="display:inline-block;width:16px;height:16px;background:#4a4;color:#fff;text-align:center;font-size:10px;line-height:16px;text-decoration:none;border-radius:2px;"><b>${s + 1}</b></a></td>`;
            } else {
              str += `<td><span style="display:inline-block;width:16px;height:16px;background:#666;color:#999;text-align:center;font-size:10px;line-height:16px;border-radius:2px;">${s + 1}</span></td>`;
            }
          }
          str += `</tr>\n`;
        }
      }
      str += `</table>\n`;
      str += `</td>\n`;

      // Right: Slot reference (3x3 numbered grid)
      str += `<td valign="top" style="padding-left:8px;">\n`;
      str += `<table cellpadding="0" cellspacing="2">\n`;
      for (let row = 0; row < 3; row++) {
        str += `<tr>`;
        for (let col = 0; col < 3; col++) {
          const slot = row * 3 + col;
          const isEmpty = emptySlots.includes(slot);
          const bg = isEmpty ? '#4a4' : '#666';
          const color = isEmpty ? '#fff' : '#999';
          str += `<td align="center" width="20" height="20" style="background:${bg};color:${color};font-size:11px;font-weight:bold;border-radius:2px;">${slot + 1}</td>`;
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

    str += `<hr>\n\n`;

    return str;
  }
}
