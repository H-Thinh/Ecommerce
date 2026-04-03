import { endOfYesterday, startOfYesterday } from "date-fns";
import prisma from "../PrismaClient";

const generateYesterdayReport = async () => {
  const start = startOfYesterday();
  const end = endOfYesterday();

  const totalOrders = await prisma.order.count({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
      status: {
        is_final: true, // hoặc status.name = 'completed'
      },
    },
  });

  const revenueResult = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: "success",
      payment_date: {
        gte: start,
        lte: end,
      },
    },
  });

  const totalRevenue = revenueResult._sum.amount || 0;

  const newUsers = await prisma.user.count({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  });

  return await prisma.dailyReport.upsert({
    where: {
      report_date: start,
    },
    update: {
      total_orders: totalOrders,
      total_revenue: totalRevenue,
      new_users: newUsers,
    },
    create: {
      report_date: start,
      total_orders: totalOrders,
      total_revenue: totalRevenue,
      new_users: newUsers,
    },
  });
};

export const getDailyReportsByRange = async (start: Date, end: Date) => {
  return prisma.dailyReport.findMany({
    where: {
      report_date: { gte: start, lte: end },
    },
  });
};

const deleteDailyReportById = async (id: number) =>
  await prisma.dailyReport.delete({ where: { id } });

const dailyReportModel = {
  deleteDailyReportById,
  getDailyReportsByRange,
  generateYesterdayReport,
};

export default dailyReportModel;
