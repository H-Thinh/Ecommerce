import { Router } from "express";

import saleController from "../../controllers/saleController";

import verifyToken from "../../middlewares/verifyToken";
import { checkRole } from "../../middlewares/checkRole";

const router = Router();

router.get("/", verifyToken, checkRole(["admin"]), saleController.getAllSales);

router.get("/active", verifyToken, saleController.getActiveSales);

router.get(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  saleController.getSaleById,
);

router.post("/", verifyToken, checkRole(["admin"]), saleController.createSale);

router.put(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  saleController.updateSaleById,
);

router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  saleController.deleteSaleById,
);

export default router;
