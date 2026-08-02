import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { WatchService } from './watch.service';

@Controller('watch')
export class WatchController {
  constructor(private watchService: WatchService) {}

  @Get('compatible-parts')
  public getCompatable(@Query('partId', ParseIntPipe) partId: number) {
    return this.watchService.getCompatible(partId);
  }

  @Get('parts')
  public getAllParts() {
    return this.watchService.getAll();
  }

  @Get('initial-parts')
  public getInitialParts() {
    return this.watchService.getFirstCompatableSequence();
  }
}
