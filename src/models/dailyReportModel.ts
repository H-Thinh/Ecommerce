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
  const dailyReports = await prisma.dailyReport.findMany({
    where: {
      report_date: { gte: start, lte: end },
    },
  });

  return dailyReports.map((report) => {
    return {
      totalOrders: report.total_orders,
      totalUsers: report.new_users,
      totalRevenue: report.total_revenue,
      totalProductsSold: report.total_products_sold,
    };
  });
};

const getRevenueByYear = async (year: number) => {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31, 23, 59, 59, 999);

  const reports = await prisma.dailyReport.findMany({
    where: {
      report_date: {
        gte: start,
        lte: end,
      },
    },
  });

  const monthlyRevenue = Array(12).fill(0);

  reports.forEach((report) => {
    const month = new Date(report.report_date).getMonth();
    monthlyRevenue[month] += Number(report.total_revenue) || 0;
  });

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-based, 0 = Jan

  const maxMonth = year === currentYear ? currentMonth : 11;

  return monthlyRevenue
    .map((value, index) => ({ month: index + 1, revenue: value }))
    .filter((item) => item.month - 1 <= maxMonth); // loại bỏ tháng tương lai
};

const deleteDailyReportById = async (id: number) =>
  await prisma.dailyReport.delete({ where: { id } });

const dailyReportModel = {
  getRevenueByYear,
  deleteDailyReportById,
  getDailyReportsByRange,
  generateYesterdayReport,
};

export default dailyReportModel;
