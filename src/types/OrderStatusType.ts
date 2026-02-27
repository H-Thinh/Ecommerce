export interface CreateOrderStatusType {
  name: string;
  code: string;
  sort_order?: number;
  hex: string;
  is_final?: boolean;
  description: string;
  is_cancelable?: boolean;
}

export interface UpdateOrderStatusType {
  name?: string;
  code?: string;
  sort_order?: number;
  hex?: string;
  description?: string;
  is_final?: boolean;
  is_cancelable?: boolean;
}

export default interface OrderStatusType {
  id: number;
  name: string;
  code: string;
  hex?: string;
  sort_order?: number;
  description: string;
  is_final: boolean;
  is_cancelable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
