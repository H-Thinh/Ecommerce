import AccountType from "../types/AccountType";

const accountValidation = (data: AccountType) => {
  const errors: Partial<Record<keyof AccountType, string>> = {};

  if (!data.name) {
    errors.name = "Vui lòng nhập name";
  }

  if (!data.email) {
    errors.email = "Vui lòng nhập email";
  }

  if (!data.phone) {
    errors.phone = "Vui lòng nhập số phone";
  }

  if (!data.password) {
    errors.password = "Vui lòng nhập password";
  }

  if (!data.roleId) {
    errors.roleId = "Vui lòng chọn role";
  }

  return errors;
};

export default accountValidation;
