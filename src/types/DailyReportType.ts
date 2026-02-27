import { Prisma } from "../generated/prisma";

export default interface DailyReportType {
  report_date: Date;
  total_orders: number;
  total_revenue: Prisma.Decimal;
  new_users: number;
}
