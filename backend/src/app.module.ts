import { Module } from '@nestjs/common';
import { WatchModule } from './watch/watch.module';
import { PrismaModule } from './prisma/prisma.module';
import { DbSeederModule } from './db-seeder/db-seeder.module';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    WatchModule,
    PrismaModule,
    DbSeederModule,
    OrderModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
