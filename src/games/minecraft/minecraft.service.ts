import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { MinecraftCraftingDynamicModule } from 'src/modules/dynamics/minecraft-crafting.module';
import State from 'src/State';
import ReadmeService from 'src/services/ReadmeService';

@Injectable()
export class MinecraftService {

  private getModule(id: string): MinecraftCraftingDynamicModule | undefined {
    return State.modules.find(
      m => m.data['uuid'] === id
    ) as MinecraftCraftingDynamicModule;
  }

  async place(id: string, slot: number, item: string, res: Response) {
    const module = this.getModule(id);
    if (!module) {
      return ReadmeService.doNothingAndRedirect(res, '#minecraft-crafting');
    }

    const success = await module.place(slot, item);
    if (success) {
      await ReadmeService.updateReadmeAndRedirect(
        `:hammer: Place ${item} in slot ${slot}`,
        res,
        '#minecraft-crafting'
      );
    } else {
      ReadmeService.doNothingAndRedirect(res, '#minecraft-crafting');
    }
  }

  async remove(id: string, slot: number, res: Response) {
    const module = this.getModule(id);
    if (!module) {
      return ReadmeService.doNothingAndRedirect(res, '#minecraft-crafting');
    }

    const success = await module.remove(slot);
    if (success) {
      await ReadmeService.updateReadmeAndRedirect(
        ':wastebasket: Remove item from slot',
        res,
        '#minecraft-crafting'
      );
    } else {
      ReadmeService.doNothingAndRedirect(res, '#minecraft-crafting');
    }
  }

  async craft(id: string, res: Response) {
    const module = this.getModule(id);
    if (!module) {
      return ReadmeService.doNothingAndRedirect(res, '#minecraft-crafting');
    }

    const success = await module.craft();
    if (success) {
      await ReadmeService.updateReadmeAndRedirect(
        ':sparkles: Craft item',
        res,
        '#minecraft-crafting'
      );
    } else {
      ReadmeService.doNothingAndRedirect(res, '#minecraft-crafting');
    }
  }

  async clear(id: string, res: Response) {
    const module = this.getModule(id);
    if (!module) {
      return ReadmeService.doNothingAndRedirect(res, '#minecraft-crafting');
    }

    await module.clear();
    await ReadmeService.updateReadmeAndRedirect(
      ':broom: Clear crafting grid',
      res,
      '#minecraft-crafting'
    );
  }

  async reset(id: string, res: Response) {
    const module = this.getModule(id);
    if (!module) {
      return ReadmeService.doNothingAndRedirect(res, '#minecraft-crafting');
    }

    await module.reset();
    await ReadmeService.updateReadmeAndRedirect(
      ':arrows_counterclockwise: Reset crafting',
      res,
      '#minecraft-crafting'
    );
  }
}
