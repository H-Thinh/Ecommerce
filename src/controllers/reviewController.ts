import { Request, Response } from "express";
import reviewModel from "../models/reviewModel";
import {
  reviewValidation,
  updateReviewValidation,
} from "../validation/reviewValidation";
import { CreateReviewType, UpdateReviewType } from "../types/ReviewType";
import { AuthenticatedRequest } from "../types/express";
import prisma from "../PrismaClient";

const createReview = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Vui lòng đăng nhập" });
    }

    const { rating, comment, orderItemId, productId } = req.body || {};

    const files = req.files as Express.Multer.File[];

    const image_urls = files.map((file) => file.path);

    const reviewData: CreateReviewType = {
      userId,
      rating: parseInt(rating),
      comment,
      orderItemId: parseInt(orderItemId),
      productId: parseInt(productId),
      images: JSON.stringify(image_urls),
    };

    const errors = reviewValidation(reviewData);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
      },
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "Bạn đã đánh giá sản phẩm này rồi" });
    }

    const review = await reviewModel.createReview(reviewData);
    return res
      .status(201)
      .json({ message: "Tạo đánh giá thành công", data: review });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await reviewModel.getAllReviews();
    return res
      .status(200)
      .json({ message: "Lấy danh sách đánh giá thành công", data: reviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getReviewById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID đánh giá không hợp lệ" });
    }

    const review = await reviewModel.getReviewById(id);

    if (!review) {
      return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    }

    return res
      .status(200)
      .json({ message: "Lấy thông tin đánh giá thành công", data: review });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getReviewsByProductId = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.productId);

    if (!productId) {
      return res.status(400).json({ message: "ID sản phẩm không hợp lệ" });
    }

    const reviews = await reviewModel.getReviewsByProductId(productId);
    return res
      .status(200)
      .json({ message: "Lấy đánh giá sản phẩm thành công", data: reviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getMyReviews = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Vui lòng đăng nhập" });
    }

    const reviews = await reviewModel.getReviewsByUserId(userId);
    return res
      .status(200)
      .json({ message: "Lấy đánh giá của bạn thành công", data: reviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getPendingReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await reviewModel.getPendingReviews();
    return res
      .status(200)
      .json({ message: "Lấy đánh giá chờ duyệt thành công", data: reviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const updateReviewById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID đánh giá không hợp lệ" });
    }

    const existingReview = await reviewModel.getReviewById(id);
    if (!existingReview) {
      return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    }

    const { rating, comment, is_approved, approved_by } = req.body || {};

    const updateData: UpdateReviewType = {};

    if (rating !== undefined) updateData.rating = parseInt(rating);
    if (comment !== undefined) updateData.comment = comment;
    if (is_approved !== undefined)
      updateData.is_approved = Boolean(is_approved);
    if (approved_by !== undefined)
      updateData.approved_by = parseInt(approved_by);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
    }

    const errors = updateReviewValidation(updateData);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    const review = await reviewModel.updateReviewById(id, updateData);
    return res
      .status(200)
      .json({ message: "Cập nhật đánh giá thành công", data: review });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const approveReview = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const adminId = (req as AuthenticatedRequest).user?.id;

    if (!id) {
      return res.status(400).json({ message: "ID đánh giá không hợp lệ" });
    }

    if (!adminId) {
      return res.status(401).json({ message: "Vui lòng đăng nhập" });
    }

    const existingReview = await reviewModel.getReviewById(id);
    if (!existingReview) {
      return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    }

    const review = await reviewModel.updateReviewById(id, {
      is_approved: true,
      approved_by: adminId,
    });

    return res
      .status(200)
      .json({ message: "Duyệt đánh giá thành công", data: review });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const deleteReviewById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID đánh giá không hợp lệ" });
    }

    const existingReview = await reviewModel.getReviewById(id);
    if (!existingReview) {
      return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    }

    await reviewModel.deleteReviewById(id);
    return res.status(200).json({ message: "Xóa đánh giá thành công" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const moderateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { adminId, status } = req.body || {};

    if (!id || !adminId || !status) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const review = await reviewModel.moderateReview(
      Number(id),
      Number(adminId),
      status,
    );

    return res.status(200).json({
      message:
        review.status === "APPROVED"
          ? "Chấp nhận review này"
          : "Từ chối review này",
      data: review,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

const replyToReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { adminId, content } = req.body || {};

    if (!id || !adminId || !content) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const review = await reviewModel.replyToReview(
      Number(id),
      Number(adminId),
      content,
    );

    return res.status(200).json({
      message: "Trả lời đánh giá thành công",
      data: review,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

const reviewController = {
  getMyReviews,
  createReview,
  replyToReview,
  getAllReviews,
  getReviewById,
  approveReview,
  moderateReview,
  updateReviewById,
  deleteReviewById,
  getPendingReviews,
  getReviewsByProductId,
};

export default reviewController;
