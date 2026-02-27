import express from "express";

import provinceController from "../../controller/provinceController";
import verifyToken from "../../middlewares/verifyToken";

const router = express.Router();

router.get("/", verifyToken, provinceController.getProvinces);

router.post("/", verifyToken, provinceController.createProvince);

router.put("/:provinceId", verifyToken, provinceController.updateProvinceById);

router.delete(
  "/:provinceId",
  verifyToken,
  provinceController.deleteProvinceById,
);

export default router;
