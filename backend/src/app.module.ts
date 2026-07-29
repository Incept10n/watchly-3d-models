import { Module } from '@nestjs/common';
import { WatchModule } from './watch/watch.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [WatchModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
