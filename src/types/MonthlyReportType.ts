import { Prisma } from "../generated/prisma";

export default interface MonthlyReportType {
  year: number;
  month: number;
  total_orders: number;
  total_revenue: Prisma.Decimal;
  new_users: number;
}
