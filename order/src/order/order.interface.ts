export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: OrderStatus;
  items: OrderItem[];
  shipping_address?: string;
  created_at: number;
  updated_at: number;
}

export interface CreateOrderDto {
  user_id: string;
  total_amount: number;
  items: OrderItem[];
  shipping_address?: string;
}

export interface GetOrderRequest {
  id: string;
}

export interface GetUserOrdersRequest {
  user_id: string;
}

export interface UpdateOrderStatusDto {
  id: string;
  status: OrderStatus;
}

export interface DeleteOrderRequest {
  id: string;
}
