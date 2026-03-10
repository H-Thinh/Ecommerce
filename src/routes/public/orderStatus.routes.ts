import { Router } from "express";

import verifyToken from "../../middlewares/verifyToken";

import orderStatusController from "../../controllers/orderStatusController";

const router = Router();

router.get("/", verifyToken, orderStatusController.getAllOrderStatuses);

export default router;
