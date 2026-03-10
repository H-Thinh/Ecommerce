import { Router } from "express";
import verifyToken from "../../middlewares/verifyToken";
import { uploadImageReview } from "../../middlewares/upload";
import reviewController from "../../controllers/reviewController";

const router = Router();

router.post(
  "/",
  verifyToken,
  uploadImageReview.array("reivewImage"),
  reviewController.createReview,
);

router.get("/my-reviews", verifyToken, reviewController.getMyReviews);

router.get(
  "/product/:productId",
  verifyToken,
  reviewController.getReviewsByProductId,
);

router.patch("/:id/approve", verifyToken, reviewController.approveReview);

export default router;
