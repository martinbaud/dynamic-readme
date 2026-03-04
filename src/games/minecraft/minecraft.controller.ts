import {
  Controller,
  Get,
  Param,
  Query,
  Res
} from '@nestjs/common';
import { Response } from 'express';
import { MinecraftService } from './minecraft.service';

@Controller('minecraft')
export class MinecraftController {
  constructor(
    private minecraftService: MinecraftService
  ) {}

  @Get(':id/place')
  async place(
    @Param('id') id: string,
    @Query('slot') slot: string,
    @Query('item') item: string,
    @Res() res: Response
  ) {
    return this.minecraftService.place(id, +slot, item, res);
  }

  @Get(':id/remove')
  async remove(
    @Param('id') id: string,
    @Query('slot') slot: string,
    @Res() res: Response
  ) {
    return this.minecraftService.remove(id, +slot, res);
  }

  @Get(':id/craft')
  async craft(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    return this.minecraftService.craft(id, res);
  }

  @Get(':id/clear')
  async clear(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    return this.minecraftService.clear(id, res);
  }

  @Get(':id/reset')
  async reset(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    return this.minecraftService.reset(id, res);
  }
}
