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

  async getAllOrders(uid?: string, page = 1, limit = 12) {
    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(Math.max(limit, 1), 100);

    const where = uid
      ? {
          uid: {
            contains: uid,
            mode: 'insensitive' as const,
          },
        }
      : undefined;

    const [orders, total] = await this.prismaService.$transaction([
      this.prismaService.order.findMany({
        where,
        include: {
          items: {
            include: {
              part: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
      }),
      this.prismaService.order.count({ where }),
    ]);

    const items = orders.map((order) => ({
      id: order.id,
      uid: order.uid,
      createdAt: order.createdAt,
      itemCount: order.items.length,
      totalCost: order.items.reduce(
        (sum, item) => sum + Number(item.part.cost),
        0,
      ),
    }));

    return {
      items,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async getOrderByUid(uid: string) {
    const order = await this.prismaService.order.findUnique({
      where: { uid },
      include: {
        items: {
          include: {
            part: true,
          },
        },
      },
    });

    if (!order) {
      return null;
    }

    return {
      id: order.id,
      uid: order.uid,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        id: item.id,
        part: {
          id: item.part.id,
          name: item.part.name,
          type: item.part.type,
          cost: Number(item.part.cost),
          pictureUrl: item.part.pictureUrl,
        },
      })),
      totalCost: order.items.reduce(
        (sum, item) => sum + Number(item.part.cost),
        0,
      ),
    };
  }
}
