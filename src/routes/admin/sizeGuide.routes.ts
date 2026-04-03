import { Router } from "express";
import sizeGuideController from "../../controllers/sizeGuideController";
import verifyToken from "../../middlewares/verifyToken";

const router = Router();

router.post("/", verifyToken, sizeGuideController.createSizeGuide);

// lấy size guide theo category
router.get(
  "/category/:categoryId",
  verifyToken,
  sizeGuideController.getSizeGuideByCategory,
);

// update measurement trong size guide
router.put(
  "/:sizeGuideId/measurement/:sizeMeasurementId",
  verifyToken,
  sizeGuideController.updateSizeGuideById,
);

export default router;
