import { Router } from "express";
import saleController from "../../controller/saleController";

const router = Router();

router.get("/", saleController.getAllSales);

router.get("/active", saleController.getActiveSales);

router.get("/:id", saleController.getSaleById);

router.post("/", saleController.createSale);

router.put("/:id", saleController.updateSaleById);

router.delete("/:id", saleController.deleteSaleById);

export default router;
