import { Controller, Get, Query } from '@nestjs/common';
import { WatchService } from './watch.service';

@Controller('watch')
export class WatchController {
  constructor(private watchService: WatchService) {}

  @Get('compatible-parts')
  public getCompatable(@Query('partIds') partIds: string) {
    return this.watchService.getCompatible(
      partIds.split(',').map((item) => parseInt(item)),
    );
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
