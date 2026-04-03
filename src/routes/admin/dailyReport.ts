import express from "express";
import dailyReportController from "../../controllers/dailyRepostController";
import verifyToken from "../../middlewares/verifyToken";

const router = express.Router();

router.post("/", verifyToken, dailyReportController.generateYesterdayReport);

router.get("/day", verifyToken, dailyReportController.getDailyReportsByDay);

router.get("/month", verifyToken, dailyReportController.getDailyReportsByMonth);

export default router;
