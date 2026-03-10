import { Decimal } from "@prisma/client/runtime/library";

type StatusPayment =
  | "pending"
  | "processing"
  | "success"
  | "failed"
  | "refunded";

export default interface PaymentType {
  id: number;
  orderId: number;
  amount: Decimal;
  status: StatusPayment;
  payment_method: number;
  transaction_reference?: string;
  payment_date?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentType {
  orderId: number;
  amount: number;
  status?: StatusPayment;
  payment_method: number;
  transaction_reference?: string;
  payment_date?: Date;
}

export interface UpdatePaymentType {
  amount?: number;
  status?: StatusPayment;
  payment_method?: number;
  transaction_reference?: string;
  payment_date?: Date;
}
