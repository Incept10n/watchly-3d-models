import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';

export class CreateOrderDto {
  partIds: number[];
}

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(dto.partIds);
  }

  @Get()
  getAllOrders(
    @Query('uid') uid?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.orderService.getAllOrders(
      uid,
      page ? +page : undefined,
      limit ? +limit : undefined,
    );
  }

  @Get(':uid')
  getOrderByUid(@Param('uid') uid: string) {
    return this.orderService.getOrderByUid(uid);
  }
}
