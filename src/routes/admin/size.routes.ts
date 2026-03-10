import { Router } from "express";
import verifyToken from "../../middlewares/verifyToken";
import sizeController from "../../controllers/sizeController";

const router = Router();

router.get("/", verifyToken, sizeController.getSizes);

router.post("/", verifyToken, sizeController.createSize);

router.put("/:sizeId", verifyToken, sizeController.updateSizeById);

router.delete("/:sizeId", verifyToken, sizeController.deleteSizeById);

export default router;
