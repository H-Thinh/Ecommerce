import { Prisma } from "../generated/prisma";
import prisma from "../PrismaClient";
import cron from "node-cron";

export const dailyReportCron = () => {
  cron.schedule(
    "0 0 * * *",
    async () => {
      const reportDate = new Date();
      reportDate.setDate(reportDate.getDate() - 1);
      reportDate.setHours(0, 0, 0, 0);

      const startOfDay = new Date(reportDate);
      const endOfDay = new Date(reportDate);
      endOfDay.setHours(23, 59, 59, 999);

      const [users, orders, totalRevenueResult, productsSold] =
        await Promise.all([
          prisma.user.count({
            where: { createdAt: { gte: startOfDay, lte: endOfDay } },
          }),
          prisma.order.count({
            where: {
              status: { code: "DELIVERED" },
              createdAt: { gte: startOfDay, lte: endOfDay },
            },
          }),
          prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
              status: "success",
              received_at: { gte: startOfDay, lte: endOfDay },
            },
          }),
          prisma.orderItem.aggregate({
            where: {
              createdAt: { gte: startOfDay, lte: endOfDay },
            },
            _sum: { quantity: true },
          }),
        ]);

      const totalRevenue =
        totalRevenueResult._sum.amount ?? new Prisma.Decimal(0);

      const dailyReport = await prisma.dailyReport.upsert({
        where: {
          report_date: reportDate,
        },
        update: {
          new_users: users,
          total_orders: orders,
          total_revenue: totalRevenue,
          total_products_sold: productsSold._sum.quantity || 0,
        },
        create: {
          report_date: reportDate,
          new_users: users,
          total_orders: orders,
          total_revenue: totalRevenue,
          total_products_sold: productsSold._sum.quantity || 0,
        },
      });

      console.log(
        `Daily report ${reportDate.toISOString()} saved, id=${dailyReport.id}`,
      );
    },
    { timezone: "Asia/Ho_Chi_Minh" },
  );
};
