import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OrderService } from './order.service';
import type { 
  CreateOrderDto, 
  GetOrderRequest, 
  GetUserOrdersRequest, 
  UpdateOrderStatusDto, 
  DeleteOrderRequest,
  OrderListResponse
} from '../order.interface';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @GrpcMethod('OrderService', 'CreateOrder')
  createOrder(createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @GrpcMethod('OrderService', 'GetOrder')
  getOrder(data: GetOrderRequest) {
    return this.orderService.findOne(data.id);
  }

  @GrpcMethod('OrderService', 'GetUserOrders')
  getUserOrders(data: GetUserOrdersRequest): OrderListResponse {
    const orders = this.orderService.findByUserId(data.user_id);
    return { orders };
  }

  @GrpcMethod('OrderService', 'UpdateOrderStatus')
  updateOrderStatus(data: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(data);
  }

  @GrpcMethod('OrderService', 'DeleteOrder')
  deleteOrder(data: DeleteOrderRequest) {
    this.orderService.remove(data.id);
    return {};
  }
}