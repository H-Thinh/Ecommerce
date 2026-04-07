import { Request, Response } from "express";
import dailyReportModel from "../models/dailyReportModel";

const generateYesterdayReport = async (req: Request, res: Response) => {
  try {
    const report = await dailyReportModel.generateYesterdayReport();

    return res.status(201).json({
      message: "Tạo DailyReport thành công",
      data: report,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getDailyReportsByDay = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    if (!date || typeof date !== "string") {
      return res.status(400).json({ message: "Thiếu tham số date" });
    }

    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const reports = await dailyReportModel.getDailyReportsByRange(
      startOfDay,
      endOfDay,
    );

    return res.status(200).json({ data: reports });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getDailyReportsByMonth = async (req: Request, res: Response) => {
  try {
    const { year, month } = req.query;

    if (
      !year ||
      !month ||
      typeof year !== "string" ||
      typeof month !== "string"
    ) {
      return res.status(400).json({ message: "Thiếu tham số year hoặc month" });
    }

    const y = parseInt(year, 10);
    const m = parseInt(month, 10) - 1;

    const startOfMonth = new Date(y, m, 1);
    const endOfMonth = new Date(y, m + 1, 0, 23, 59, 59, 999);

    const reports = await dailyReportModel.getDailyReportsByRange(
      startOfMonth,
      endOfMonth,
    );

    return res.status(200).json({ data: reports });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getRevenueByYear = async (req: Request, res: Response) => {
  try {
    const { year } = req.query;

    if (!year || typeof year !== "string") {
      return res.status(400).json({ message: "Thiếu tham số year" });
    }

    const y = parseInt(year, 10);

    const fullYearData = await dailyReportModel.getRevenueByYear(y);

    return res.status(200).json({
      message: "Dữ liệu năm " + year,
      data: fullYearData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const dailyReportController = {
  getRevenueByYear,
  getDailyReportsByDay,
  getDailyReportsByMonth,
  generateYesterdayReport,
};

export default dailyReportController;
