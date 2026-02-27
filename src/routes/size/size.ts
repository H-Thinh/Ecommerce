import express from "express";

import sizeController from "../../controller/sizeController";
import verifyToken from "../../middlewares/verifyToken";

const router = express.Router();

router.get("/", verifyToken, sizeController.getSizes);

router.post("/", verifyToken, sizeController.createSize);

router.put("/:sizeId", verifyToken, sizeController.updateSizeById);

router.delete("/:sizeId", verifyToken, sizeController.deleteSizeById);

export default router;
