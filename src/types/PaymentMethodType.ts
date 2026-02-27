export interface CreatePaymentMethodType {
  name: string;
  code: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdatePaymentMethodType {
  name?: string;
  code?: string;
  description?: string;
  is_active?: boolean;
}

export default interface PaymentMethodType {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}