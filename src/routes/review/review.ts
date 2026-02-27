import { Router } from "express";
import reviewController from "../../controller/reviewController";
import { checkRole } from "../../middlewares/checkRole";
import verifyToken from "../../middlewares/verifyToken";
import { uploadImageReview } from "../../middlewares/upload";

const router = Router();

// Review CRUD routes
router.post(
  "/",
  verifyToken,
  uploadImageReview.array("reivewImage"),
  reviewController.createReview,
);

router.get(
  "/",
  verifyToken,
  checkRole(["admin"]),
  reviewController.getAllReviews,
);

router.get(
  "/pending",
  verifyToken,
  checkRole(["admin"]),
  reviewController.getPendingReviews,
);

router.get("/my-reviews", verifyToken, reviewController.getMyReviews);

router.get(
  "/product/:productId",
  verifyToken,
  reviewController.getReviewsByProductId,
);

router.get("/:id", verifyToken, reviewController.getReviewById);

router.put("/:id", verifyToken, reviewController.updateReviewById);

router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  reviewController.deleteReviewById,
);

// Special routes
router.patch("/:id/approve", verifyToken, reviewController.approveReview);

export default router;
