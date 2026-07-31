import { Module } from '@nestjs/common';
import { DbSeederController } from './db-seeder.controller';
import { DbSeederService } from './db-seeder.service';

@Module({
  controllers: [DbSeederController],
  providers: [DbSeederService]
})
export class DbSeederModule {}
