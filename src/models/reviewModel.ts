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

const getAllReviews = async () =>
  await prisma.review.findMany({
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
    orderBy: {
      createdAt: "desc",
    },
  });

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

const reviewModel = {
  createReview,
  getAllReviews,
  getReviewById,
  getReviewsByProductId,
  getReviewsByUserId,
  getPendingReviews,
  updateReviewById,
  deleteReviewById,
};

export default reviewModel;
