import { Body, Controller, Post } from '@nestjs/common';
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
}
