import express from "express";
import dailyReportController from "../../controller/dailyRepostController";
import verifyToken from "../../middlewares/verifyToken";

const router = express.Router();

router.post("/", verifyToken, dailyReportController.generateYesterdayReport);

export default router;
