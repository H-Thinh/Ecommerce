export interface OrderItemType {
  orderId: number;
  variantId: number;
  price: number;
  quantity: number;
}

export interface CreateOrderItemType {
  variantId: number;
  price: number;
  quantity: number;
}

export default interface OrderType {
  userId: number;
  voucherId?: number;
  provinceId?: number;
  statusId?: number;
  total_price: number;
  shipping_fee?: number;
  used_points?: number;
  earned_points?: number;
  payment_method: number;
  shipping_address?: string;
  item: OrderItemType[];
}

export interface CreateOrderType {
  userId: number;
  voucherId?: number;
  statusId: number;
  total_price: number;
  shipping_fee: number;
  used_points?: number;
  earned_points?: number;
  payment_method: number;
  point_discount_amount?: number;
  receiver_address: string;
  receiver_email: string;
  receiver_name: string;
  receiver_note?: string;
  receiver_phone: string;
  item: CreateOrderItemType[];
}
