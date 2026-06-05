// client/src/order-client.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Patch, Inject } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import type { 
  CreateOrderDto, 
  UpdateOrderStatusDto,
  OrderServiceClient
} from './order.interface';

@Controller('v1/orders')
export class OrderClientController {
  private orderService!: OrderServiceClient;

  // constructor(@Inject('ORDER_PACKAGE') private readonly client: ClientGrpc) {}
  constructor(@Inject('USER_PACKAGE') private readonly client: ClientGrpc){}

  onModuleInit() {
    this.orderService = this.client.getService<OrderServiceClient>('OrderService');
  }

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return firstValueFrom(this.orderService.createOrder(createOrderDto));
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return firstValueFrom(this.orderService.getOrder({ id }));
  }

  @Get('user/:userId')
  async getUserOrders(@Param('userId') userId: string) {
    return firstValueFrom(this.orderService.getUserOrders({ user_id: userId }));
  }

  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return firstValueFrom(
      this.orderService.updateOrderStatus({ id, status: updateOrderStatusDto.status }),
    );
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    return firstValueFrom(this.orderService.deleteOrder({ id }));
  }
}