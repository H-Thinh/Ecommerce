import OrderType, { OrderItemType, CreateOrderType } from "../types/OrderType";

const orderValidation = (data: CreateOrderType) => {
  const errors: Partial<Record<keyof CreateOrderType, string>> = {};

  if (!data.userId) {
    errors.userId = "Vui lòng đăng nhập";
  }

  if (!data.total_price) {
    errors.total_price = "Vui lòng nhập tổng tiền";
  }

  if (data.total_price && data.total_price <= 0) {
    errors.total_price = "Tổng tiền phải lớn hơn 0";
  }

  if (!data.payment_method) {
    errors.payment_method = "Vui lòng chọn phương thức thanh toán";
  }

  if (!data.item || !Array.isArray(data.item) || data.item.length === 0) {
    errors.item = "Vui lòng thêm sản phẩm vào đơn hàng";
  }

  return errors;
};

const orderItemValidation = (data: OrderItemType) => {
  const errors: Partial<Record<keyof OrderItemType, string>> = {};

  if (!data.orderId) {
    errors.orderId = "Vui lòng chọn đơn hàng";
  }

  if (!data.variantId) {
    errors.variantId = "Vui lòng chọn sản phẩm";
  }

  if (!data.price) {
    errors.price = "Vui lòng nhập giá";
  }

  if (data.price && data.price <= 0) {
    errors.price = "Giá phải lớn hơn 0";
  }

  if (!data.quantity) {
    errors.quantity = "Vui lòng nhập số lượng";
  }

  if (data.quantity && data.quantity <= 0) {
    errors.quantity = "Số lượng phải lớn hơn 0";
  }

  return errors;
};

export { orderValidation, orderItemValidation };
