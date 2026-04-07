import { Router } from "express";
import verifyToken from "../../middlewares/verifyToken";
import { checkRole } from "../../middlewares/checkRole";
import reviewController from "../../controllers/reviewController";

const router = Router();

router.get(
  "/",
  verifyToken,
  checkRole(["admin"]),
  reviewController.getAllReviews,
);

router.get("/pending", verifyToken, reviewController.getPendingReviews);

router.get(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  reviewController.getReviewById,
);

router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  reviewController.deleteReviewById,
);

router.patch(
  "/:id/moderate",
  verifyToken,
  checkRole(["admin"]),
  reviewController.moderateReview,
);

router.patch(
  "/:id/reply",
  verifyToken,
  checkRole(["admin"]),
  reviewController.replyToReview,
);

export default router;
