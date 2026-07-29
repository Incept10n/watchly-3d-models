import { Controller, Get, Query } from '@nestjs/common';
import { WatchPart } from './models';
import { WatchService } from './watch.service';

@Controller('watch')
export class WatchController {
  constructor(private watchService: WatchService) {}

  @Get('compatableParts')
  public getCompatable(@Query('baseParts') baseParts: number[]) {
    return this.watchService.getCompatable(baseParts);
  }

  @Get('parts')
  public getAllParts() {
    return this.watchService.getAll();
  }
}
