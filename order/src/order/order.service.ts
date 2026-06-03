import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Order, OrderStatus, CreateOrderDto, UpdateOrderStatusDto } from './order.interface';

@Injectable()
export class OrderService {
  // 纯内存存储订单数据（生产环境替换为数据库）
  private readonly orders: Map<string, Order> = new Map();

  // 创建订单
  create(createOrderDto: CreateOrderDto): Order {
    const now = Date.now();
    const order: Order = {
      id: uuidv4(),
      ...createOrderDto,
      status: OrderStatus.PENDING,
      created_at: now,
      updated_at: now,
    };

    this.orders.set(order.id, order);
    return order;
  }

  // 根据ID查询订单
  findOne(id: string): Order {
    const order = this.orders.get(id);

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  // 查询用户所有订单
  findByUserId(user_id: string): Order[] {
    return Array.from(this.orders.values())
      .filter(order => order.user_id === user_id)
      .sort((a, b) => b.created_at - a.created_at);
  }

  // 更新订单状态
  updateStatus(updateOrderStatusDto: UpdateOrderStatusDto): Order {
    const order = this.findOne(updateOrderStatusDto.id);
    
    order.status = updateOrderStatusDto.status;
    order.updated_at = Date.now();
    
    this.orders.set(order.id, order);
    return order;
  }

  // 删除订单
  remove(id: string): void {
    const exists = this.orders.has(id);

    if (!exists) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    this.orders.delete(id);
  }
}