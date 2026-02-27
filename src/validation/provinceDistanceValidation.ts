import { CreateProvinceDistanceType, UpdateProvinceDistanceType } from "../types/ProvinceDistanceType";

const provinceDistanceValidation = (data: CreateProvinceDistanceType) => {
  const errors: Partial<Record<keyof CreateProvinceDistanceType, string>> = {};

  if (!data.fromProvinceId) {
    errors.fromProvinceId = "Vui lòng chọn tỉnh xuất phát";
  }

  if (!data.toProvinceId) {
    errors.toProvinceId = "Vui lòng chọn tỉnh đích";
  }

  if (data.fromProvinceId && data.toProvinceId && data.fromProvinceId === data.toProvinceId) {
    errors.toProvinceId = "Tỉnh xuất phát và tỉnh đích không được giống nhau";
  }

  if (!data.distance_km) {
    errors.distance_km = "Vui lòng nhập khoảng cách";
  }

  if (data.distance_km && data.distance_km <= 0) {
    errors.distance_km = "Khoảng cách phải lớn hơn 0";
  }

  if (data.distance_km && data.distance_km > 10000) {
    errors.distance_km = "Khoảng cách không được vượt quá 10,000 km";
  }

  return errors;
};

const updateProvinceDistanceValidation = (data: UpdateProvinceDistanceType) => {
  const errors: Partial<Record<keyof UpdateProvinceDistanceType, string>> = {};

  if (data.fromProvinceId && data.toProvinceId && data.fromProvinceId === data.toProvinceId) {
    errors.toProvinceId = "Tỉnh xuất phát và tỉnh đích không được giống nhau";
  }

  if (data.distance_km !== undefined) {
    if (data.distance_km <= 0) {
      errors.distance_km = "Khoảng cách phải lớn hơn 0";
    }

    if (data.distance_km > 10000) {
      errors.distance_km = "Khoảng cách không được vượt quá 10,000 km";
    }
  }

  return errors;
};

const bulkProvinceDistanceValidation = (data: CreateProvinceDistanceType[]) => {
  const errors: string[] = [];

  if (!Array.isArray(data) || data.length === 0) {
    errors.push("Dữ liệu phải là một mảng và không được rỗng");
    return errors;
  }

  data.forEach((item, index) => {
    const itemErrors = provinceDistanceValidation(item);
    if (Object.keys(itemErrors).length > 0) {
      errors.push(`Dòng ${index + 1}: ${Object.values(itemErrors).join(", ")}`);
    }
  });

  return errors;
};

export { 
  provinceDistanceValidation, 
  updateProvinceDistanceValidation,
  bulkProvinceDistanceValidation 
};