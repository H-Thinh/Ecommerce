import {
  CreateOrderStatusType,
  UpdateOrderStatusType,
} from "../types/OrderStatusType";

export const orderStatusValidation = (data: CreateOrderStatusType) => {
  const errors: any = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = "Tên trạng thái đơn hàng không được để trống";
  }

  if (
    data.sort_order !== undefined &&
    (isNaN(data.sort_order) || data.sort_order < 0)
  ) {
    errors.sort_order = "Thứ tự sắp xếp phải là số không âm";
  }

  return errors;
};

export const updateOrderStatusValidation = (data: UpdateOrderStatusType) => {
  const errors: any = {};

  if (
    data.name !== undefined &&
    (!data.name || data.name.trim().length === 0)
  ) {
    errors.name = "Tên trạng thái đơn hàng không được để trống";
  }

  if (
    data.sort_order !== undefined &&
    (isNaN(data.sort_order) || data.sort_order < 0)
  ) {
    errors.sort_order = "Thứ tự sắp xếp phải là số không âm";
  }

  return errors;
};
