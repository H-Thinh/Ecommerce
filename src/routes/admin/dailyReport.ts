import express from "express";
import dailyReportController from "../../controllers/dailyReportController";
import verifyToken from "../../middlewares/verifyToken";

const router = express.Router();

router.post("/", verifyToken, dailyReportController.generateYesterdayReport);

router.get("/day", verifyToken, dailyReportController.getDailyReportsByDay);

router.get("/month", verifyToken, dailyReportController.getDailyReportsByMonth);

router.get("/year", verifyToken, dailyReportController.getRevenueByYear);

export default router;
