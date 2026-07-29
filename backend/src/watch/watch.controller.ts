import { Controller, Get, Query } from '@nestjs/common';
import { WatchService } from './watch.service';

@Controller('watch')
export class WatchController {
  constructor(private watchService: WatchService) {}

  @Get('compatable-parts')
  public getCompatable(
    @Query('caseId') caseId: number | undefined,
    @Query('movementId') movementId: number | undefined,
  ) {
    return this.watchService.getCompatible(caseId, movementId);
  }

  @Get('parts')
  public getAllParts() {
    return this.watchService.getAll();
  }
}
