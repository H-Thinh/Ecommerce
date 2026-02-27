import express from "express";
import provinceDistanceController from "../../controller/provinceDistanceController";
import verifyToken from "../../middlewares/verifyToken";

const router = express.Router();

// Public routes - get distance information
router.get(
  "/",
  verifyToken,
  provinceDistanceController.getAllProvinceDistances,
);

router.get(
  "/search",
  verifyToken,
  provinceDistanceController.getDistanceBetweenProvinces,
);

router.get(
  "/:provinceDistanceId",
  verifyToken,
  provinceDistanceController.getProvinceDistanceById,
);

router.post(
  "/",
  verifyToken,
  provinceDistanceController.createProvinceDistance,
);

router.put(
  "/:provinceDistanceId",
  verifyToken,
  provinceDistanceController.updateProvinceDistanceById,
);

router.delete(
  "/:provinceDistanceId",
  verifyToken,
  provinceDistanceController.deleteProvinceDistanceById,
);

export default router;
