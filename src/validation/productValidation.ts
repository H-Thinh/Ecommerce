import ProductType, { ProductVariantType } from "../types/ProductType";

const productValidation = (data: ProductType) => {
  const errors: Partial<Record<keyof ProductType, string>> = {};

  if (!data.name_product) {
    errors.name_product = "Vui lòng nhập tên sản phẩm";
  }

  if (!data.price) {
    errors.price = "Vui lòng nhập giá sản phẩm";
  }

  if (data.price && data.price <= 0) {
    errors.price = "Giá sản phẩm phải lớn hơn 0";
  }

  return errors;
};

const productVariantValidation = (data: ProductVariantType) => {
  const errors: Partial<Record<keyof ProductVariantType, string>> = {};

  if (!data.productId) {
    errors.productId = "Vui lòng chọn sản phẩm";
  }

  if (data.stock === undefined || data.stock === null) {
    errors.stock = "Vui lòng nhập số lượng tồn kho";
  }

  if (data.stock && data.stock < 0) {
    errors.stock = "Số lượng tồn kho không được âm";
  }

  return errors;
};

export { productValidation, productVariantValidation };
