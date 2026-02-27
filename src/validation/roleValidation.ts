import RoleType from "../types/RoleType";

const roleValidation = (data: RoleType) => {
  const errors: Partial<Record<keyof RoleType, string>> = {};

  if (!data.name_role) {
    errors.name_role = "Vui lòng nhập tên của role";
  }

  if (!data.description) {
    errors.description = "Vui lòng nhập mô tả về role của bạn";
  }

  if (data.permissions.length === 0) {
    errors.permissions = "Vui lòng chọn permission cho role";
  }

  return errors;
};

export default roleValidation;
