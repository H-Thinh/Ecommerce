import { Router } from "express";

import verifyToken from "../../middlewares/verifyToken";

import voucherController from "../../controllers/voucherController";

const router = Router();

router.get("/:code", verifyToken, voucherController.getVoucherByCode);

export default router;
