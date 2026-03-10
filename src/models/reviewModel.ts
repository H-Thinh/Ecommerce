import prisma from "../PrismaClient";
import { CreateReviewType, UpdateReviewType } from "../types/ReviewType";

const createReview = async (data: CreateReviewType) =>
  await prisma.review.create({
    data,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

const getAllReviews = async () => {
  const reviews = await prisma.review.findMany({
    include: {
      product: { select: { name_product: true, image_url: true } },
      orderItem: { select: { variant: { select: { image_url: true } } } },
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      reviewer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews.map((review) => {
    return {
      id: review.id,
      rating: review.rating,
      content: review.comment,
      createdAt: review.createdAt,
      status: review.status,
      product: {
        name: review.product.name_product,
        imageProduct: review.orderItem?.variant.image_url,
      },
      user: { name: review.user.name, avatar: review.user.avatar },
    };
  });
};

const getReviewById = async (id: number) =>
  await prisma.review.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      reviewer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

const getReviewsByProductId = async (productId: number) =>
  await prisma.review.findMany({
    where: {
      productId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

const getReviewsByUserId = async (userId: number) =>
  await prisma.review.findMany({
    where: { userId },
    include: {},
    orderBy: {
      createdAt: "desc",
    },
  });

const getPendingReviews = async () =>
  await prisma.review.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

const updateReviewById = async (id: number, data: UpdateReviewType) =>
  await prisma.review.update({
    where: { id },
    data: {
      ...data,
      ...(data.is_approved && { approved_at: new Date() }),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

const deleteReviewById = async (id: number) =>
  await prisma.review.delete({
    where: { id },
  });

const moderateReview = async (
  reviewId: number,
  adminId: number,
  status: "APPROVED" | "REJECTED",
) => {
  return prisma.review.update({
    where: { id: reviewId },
    data: {
      status,
      approved_by: adminId,
      approved_at: new Date(),
    },
  });
};

const replyToReview = async (
  reviewId: number,
  adminId: number,
  content: string,
) => {
  return prisma.review.update({
    where: { id: reviewId },
    data: {
      shopRepliedBy: adminId,
      shopReply: content,
      shopRepliedAt: new Date(),
    },
  });
};

const reviewModel = {
  createReview,
  getAllReviews,
  getReviewById,
  moderateReview,
  updateReviewById,
  deleteReviewById,
  getPendingReviews,
  getReviewsByUserId,
  getReviewsByProductId,
};

export default reviewModel;
