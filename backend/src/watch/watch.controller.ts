import { Controller, Get, Query } from '@nestjs/common';
import { WatchService } from './watch.service';
import { ChosenWatch } from './types';

@Controller('watch')
export class WatchController {
  constructor(private watchService: WatchService) {}

  @Get('correctTreeData')
  public getCompatable(@Query('currentTree') currentTree: string) {
    return this.watchService.formDependencyTree(
      JSON.parse(currentTree) as ChosenWatch,
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
