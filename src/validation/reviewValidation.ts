import { CreateReviewType, UpdateReviewType } from "../types/ReviewType";

export const reviewValidation = (data: CreateReviewType) => {
  const errors: any = {};

  if (!data.userId || isNaN(data.userId)) {
    errors.userId = "ID người dùng không hợp lệ";
  }

  if (
    !data.rating ||
    isNaN(data.rating) ||
    data.rating < 1 ||
    data.rating > 5
  ) {
    errors.rating = "Đánh giá phải từ 1 đến 5 sao";
  }

  if (data.comment && data.comment.trim().length > 1000) {
    errors.comment = "Bình luận không được quá 1000 ký tự";
  }

  return errors;
};

export const updateReviewValidation = (data: UpdateReviewType) => {
  const errors: any = {};

  if (
    data.rating !== undefined &&
    (isNaN(data.rating) || data.rating < 1 || data.rating > 5)
  ) {
    errors.rating = "Đánh giá phải từ 1 đến 5 sao";
  }

  if (
    data.comment !== undefined &&
    data.comment &&
    data.comment.trim().length > 1000
  ) {
    errors.comment = "Bình luận không được quá 1000 ký tự";
  }

  return errors;
};
