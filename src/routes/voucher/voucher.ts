import express from "express";
import voucherController from "../../controller/voucherController";
import verifyToken from "../../middlewares/verifyToken";

const router = express.Router();

router.post("/", verifyToken, voucherController.createVoucher);

router.get("/:code", verifyToken, voucherController.getVoucherByCode);

router.put("/:voucherId", verifyToken, voucherController.updateVoucherById);

router.delete("/:voucherId", verifyToken, voucherController.deleteVoucherById);

router.get("/", verifyToken, voucherController.getVouchers);

export default router;
