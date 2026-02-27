import SaleType from "../types/SaleType";

export const saleValidation = (data: SaleType) => {
  const errors: any = {};

  if (!data.name_sale || data.name_sale.trim() === "") {
    errors.name_sale = "Tên khuyến mãi không được để trống";
  }

  if (data.name_sale && data.name_sale.length > 200) {
    errors.name_sale = "Tên khuyến mãi không được quá 200 ký tự";
  }

  if (
    !data.discount_type ||
    !["percent", "fixed"].includes(data.discount_type)
  ) {
    errors.discount_type = "Loại giảm giá phải là 'percent' hoặc 'fixed'";
  }

  if (data.discount_value === undefined || data.discount_value < 0) {
    errors.discount_value = "Giá trị giảm giá phải lớn hơn hoặc bằng 0";
  }

  if (data.discount_type === "percent" && data.discount_value > 100) {
    errors.discount_value =
      "Giá trị giảm giá theo phần trăm không được quá 100%";
  }

  if (data.start_date && data.end_date && data.start_date >= data.end_date) {
    errors.date_range = "Ngày bắt đầu phải nhỏ hơn ngày kết thúc";
  }

  if (data.description && data.description.length > 1000) {
    errors.description = "Mô tả không được quá 1000 ký tự";
  }

  return errors;
};

export const updateSaleValidation = (data: Partial<SaleType>) => {
  const errors: any = {};

  if (data.name_sale !== undefined) {
    if (!data.name_sale || data.name_sale.trim() === "") {
      errors.name_sale = "Tên khuyến mãi không được để trống";
    }
    if (data.name_sale && data.name_sale.length > 200) {
      errors.name_sale = "Tên khuyến mãi không được quá 200 ký tự";
    }
  }

  if (
    data.discount_type !== undefined &&
    !["percent", "fixed"].includes(data.discount_type)
  ) {
    errors.discount_type = "Loại giảm giá phải là 'percent' hoặc 'fixed'";
  }

  if (data.discount_value !== undefined && data.discount_value < 0) {
    errors.discount_value = "Giá trị giảm giá phải lớn hơn hoặc bằng 0";
  }

  if (
    data.discount_type === "percent" &&
    data.discount_value !== undefined &&
    data.discount_value > 100
  ) {
    errors.discount_value =
      "Giá trị giảm giá theo phần trăm không được quá 100%";
  }

  if (data.start_date && data.end_date && data.start_date >= data.end_date) {
    errors.date_range = "Ngày bắt đầu phải nhỏ hơn ngày kết thúc";
  }

  if (
    data.description !== undefined &&
    data.description &&
    data.description.length > 1000
  ) {
    errors.description = "Mô tả không được quá 1000 ký tự";
  }

  return errors;
};
