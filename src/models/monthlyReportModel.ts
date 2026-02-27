import prisma from "../PrismaClient";
import MonthlyReportType from "../types/MonthlyReportType";

const createMonthlyReport = async (data: MonthlyReportType) =>
  await prisma.monthlyReport.create({ data });

const getMonthLyReposts = async () => await prisma.monthlyReport.findMany();

const updateMonthlyReportById = async (
  id: number,
  data: Partial<MonthlyReportType>
) => await prisma.monthlyReport.update({ where: { id }, data });

const deleteMonthlyReportById = async (id: number) =>
  await prisma.monthlyReport.delete({ where: { id } });

const monthlyReportModel = {
  getMonthLyReposts,
  createMonthlyReport,
  updateMonthlyReportById,
  deleteMonthlyReportById,
};

export default monthlyReportModel;
