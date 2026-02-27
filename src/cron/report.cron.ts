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

      const [users, orders, totalRevenueResult] = await Promise.all([
        prisma.user.count({
          where: { createdAt: { gte: startOfDay, lte: endOfDay } },
        }),
        prisma.order.count({
          where: { createdAt: { gte: startOfDay, lte: endOfDay } },
        }),
        prisma.payment.aggregate({
          _sum: { amount: true },
          where: { createdAt: { gte: startOfDay, lte: endOfDay } },
        }),
      ]);

      const totalRevenue =
        totalRevenueResult._sum.amount ?? new Prisma.Decimal(0);

      const dailyReport = await prisma.dailyReport.create({
        data: {
          report_date: reportDate,
          new_users: users,
          total_orders: orders,
          total_revenue: totalRevenue,
        },
      });

      console.log(
        `Daily report for ${startOfDay.toLocaleDateString()} saved, id=${dailyReport.id}`,
      );
    },
    { timezone: "Asia/Ho_Chi_Minh" },
  );
};

export const monthReportCron = () => {
  cron.schedule(
    "0 0 1 * *",
    async () => {
      try {
        const now = new Date();
        const startOfMonth = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1,
          0,
          0,
          0,
          0,
        );
        const endOfMonth = new Date(
          now.getFullYear(),
          now.getMonth(),
          0,
          23,
          59,
          59,
          999,
        );

        const [users, orders, totalRevenueResult] = await Promise.all([
          prisma.user.count({
            where: { createdAt: { gte: startOfMonth, lte: endOfMonth } },
          }),
          prisma.order.count({
            where: { createdAt: { gte: startOfMonth, lte: endOfMonth } },
          }),
          prisma.payment.aggregate({
            _sum: { amount: true },
            where: { createdAt: { gte: startOfMonth, lte: endOfMonth } },
          }),
        ]);

        const monthReport = await prisma.monthlyReport.create({
          data: {
            month: startOfMonth.getMonth(),
            year: startOfMonth.getFullYear(),
            new_users: users,
            total_orders: orders,
            total_revenue: totalRevenueResult._sum.amount || 0,
          },
        });

        console.log(
          `Monthly report for ${startOfMonth.toLocaleDateString()} saved, id=${monthReport.id}`,
        );
      } catch (error) {
        console.error("Error generating monthly report:", error);
      }
    },
    { timezone: "Asia/Ho_Chi_Minh" },
  );
};
