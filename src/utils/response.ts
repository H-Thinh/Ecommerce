import { Response } from "express";

/* ================== TYPE ================== */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

/* ================== SUCCESS ================== */

export const getDatas = <T>(
  res: Response,
  data: T,
  message = "Lấy dữ liệu thành công"
) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(200).json(response);
};

export const createdData = <T>(
  res: Response,
  data: T,
  message = "Tạo dữ liệu thành công"
) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(201).json(response);
};

export const updatedData = <T>(
  res: Response,
  data: T,
  message = "Cập nhật dữ liệu thành công"
) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(200).json(response);
};

export const deletedData = <T>(
  res: Response,
  data: T,
  message = "Xóa dữ liệu thành công"
) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(200).json(response);
};

export const deletedNoContentData = (
  res: Response,
  message = "Xóa dữ liệu thành công"
) => {
  return res.status(200).json({
    success: true,
    message,
  });
};

/* ================== ERROR ================== */

export const serverError = (res: Response, message = "Lỗi server") => {
  return res.status(500).json({
    success: false,
    message,
  });
};

export const badRequest = (res: Response, message = "Dữ liệu không hợp lệ") => {
  return res.status(400).json({
    success: false,
    message,
  });
};

export const notFound = (res: Response, message = "Không tìm thấy dữ liệu") => {
  return res.status(404).json({
    success: false,
    message,
  });
};

export const forbidden = (
  res: Response,
  message = "Không có quyền truy cập"
) => {
  return res.status(403).json({
    success: false,
    message,
  });
};

export const unauthorized = (res: Response, message = "Chưa đăng nhập") => {
  return res.status(401).json({
    success: false,
    message,
  });
};
