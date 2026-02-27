import {
  CreatePaymentMethodType,
  UpdatePaymentMethodType,
} from "../types/PaymentMethodType";

export const paymentMethodValidation = (data: CreatePaymentMethodType) => {
  const errors: any = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = "Tên phương thức thanh toán không được để trống";
  }

  if (!data.code || data.code.trim().length === 0) {
    errors.code = "Mã phương thức thanh toán không được để trống";
  } else if (!/^[A-Z0-9_]+$/.test(data.code)) {
    errors.code = "Mã chỉ được chứa chữ hoa, số và dấu gạch dưới";
  }

  return errors;
};

export const updatePaymentMethodValidation = (
  data: UpdatePaymentMethodType
) => {
  const errors: any = {};

  if (
    data.name !== undefined &&
    (!data.name || data.name.trim().length === 0)
  ) {
    errors.name = "Tên phương thức thanh toán không được để trống";
  }

  if (
    data.code !== undefined &&
    (!data.code || data.code.trim().length === 0)
  ) {
    errors.code = "Mã phương thức thanh toán không được để trống";
  } else if (data.code && !/^[A-Z0-9_]+$/.test(data.code)) {
    errors.code = "Mã chỉ được chứa chữ hoa, số và dấu gạch dưới";
  }

  return errors;
};
