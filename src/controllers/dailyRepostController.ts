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

const dailyReportController = { generateYesterdayReport };

export default dailyReportController;
