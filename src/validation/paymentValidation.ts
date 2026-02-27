import { CreatePaymentType, UpdatePaymentType } from "../types/PaymentType";

const validStatuses = [
  "pending",
  "processing",
  "success",
  "failed",
  "refunded",
];

export const paymentValidation = (data: CreatePaymentType) => {
  const errors: any = {};

  if (!data.orderId || isNaN(data.orderId) || data.orderId <= 0) {
    errors.orderId = "ID đơn hàng không hợp lệ";
  }

  if (!data.amount || isNaN(data.amount) || data.amount <= 0) {
    errors.amount = "Số tiền phải lớn hơn 0";
  }

  if (
    !data.payment_method ||
    isNaN(data.payment_method) ||
    data.payment_method <= 0
  ) {
    errors.payment_method = "Phương thức thanh toán không hợp lệ";
  }

  return errors;
};

export const updatePaymentValidation = (data: UpdatePaymentType) => {
  const errors: any = {};

  if (data.amount !== undefined && (isNaN(data.amount) || data.amount <= 0)) {
    errors.amount = "Số tiền phải lớn hơn 0";
  }

  if (
    data.payment_method !== undefined &&
    (isNaN(data.payment_method) || data.payment_method <= 0)
  ) {
    errors.payment_method = "Phương thức thanh toán không hợp lệ";
  }

  if (data.status !== undefined && !validStatuses.includes(data.status)) {
    errors.status = "Trạng thái thanh toán không hợp lệ";
  }

  if (
    data.transaction_reference !== undefined &&
    data.transaction_reference &&
    data.transaction_reference.length > 255
  ) {
    errors.transaction_reference = "Mã giao dịch không được quá 255 ký tự";
  }

  return errors;
};
