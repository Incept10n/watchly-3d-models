import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async createOrder(partIds: number[]) {
    const order = await this.prismaService.order.create({
      data: {
        items: {
          create: partIds.map((partId) => ({ partId })),
        },
      },
      select: {
        uid: true,
      },
    });

    return order;
  }
}
