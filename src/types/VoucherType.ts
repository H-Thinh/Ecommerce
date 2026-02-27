import { DiscountType, Prisma } from "../generated/prisma";

export default interface VoucherType {
  code: string;
  description: string;
  discount_type: DiscountType;
  discount_value: Prisma.Decimal;
  min_order_value: Prisma.Decimal;
  start_date: Date;
  end_date: Date;
  usage_limit: number;
}
