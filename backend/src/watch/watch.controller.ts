import { Controller, Get, Query } from '@nestjs/common';
import { WatchService } from './watch.service';

@Controller('watch')
export class WatchController {
  constructor(private watchService: WatchService) {}

  @Get('compatible-parts')
  public getCompatable(@Query('partId') partId: number) {
    return this.watchService.getCompatible(partId);
  }

  @Get('parts')
  public getAllParts() {
    return this.watchService.getAll();
  }
}
