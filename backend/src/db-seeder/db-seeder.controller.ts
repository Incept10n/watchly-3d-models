import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DbSeederService } from './db-seeder.service';
import { PartType } from 'generated/prisma/enums';

export class SeedPartDto {
  name: string;
  description: string;
  cost: number;
  type: PartType;
  modelUrl: string;
  pictureUrl: string;
  itemUrl: string;

  compatibilityIds: number[];
}

@Controller('db-seeder')
export class DbSeederController {
  constructor(private readonly dbSeederService: DbSeederService) {}

  @Post('part')
  createPart(@Body() dto: SeedPartDto) {
    return this.dbSeederService.createPart(dto);
  }

  @Get('parts')
  getAllParts() {
    return this.dbSeederService.getAllParts();
  }

  @Get('part/:id')
  getPart(@Param('id') id: string) {
    return this.dbSeederService.getPart(+id);
  }

  @Put('part/:id')
  updatePart(@Param('id') id: string, @Body() dto: SeedPartDto) {
    return this.dbSeederService.updatePart(+id, dto);
  }

  @Delete('part/:id')
  deletePart(@Param('id') id: string) {
    return this.dbSeederService.deletePart(+id);
  }

  @Get('compatible-options/:type')
  getCompatibleOptions(@Param('type') type: PartType) {
    return this.dbSeederService.getCompatibleOptions(type);
  }
}
