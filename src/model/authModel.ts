import prisma from "../PrismaClient";
import bcrypt from "bcryptjs";

type LoginResponse =
  | {
      success: false;
      errors: { email?: string; password?: string };
    }
  | {
      success: true;
      data: {
        id: number;
        name: string;
        email: string;
        avatar: string;
        role: string;
        is_active: boolean;
      };
    };

const loginAccount = async (data: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  const existingAccount = await prisma.account.findUnique({
    where: { email: data.email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      avatar: true,
      role: { select: { name_role: true } },
      is_active: true,
    },
  });

  if (!existingAccount?.is_active) {
    return {
      success: false,
      errors: { email: "Tài khoản đã bị khóa" },
    };
  }

  if (!existingAccount) {
    return {
      success: false,
      errors: { email: "Bạn nhập email sai" },
    };
  }

  const passwordMatch = await bcrypt.compare(
    data.password,
    existingAccount.password
  );

  if (!passwordMatch) {
    return {
      success: false,
      errors: { password: "Bạn nhập mật khẩu sai" },
    };
  }

  const { password, ...safeAccount } = existingAccount;

  return {
    success: true,
    data: {
      id: safeAccount.id,
      email: safeAccount.email,
      avatar: safeAccount.avatar,
      name: safeAccount.name,
      role: safeAccount.role.name_role,
      is_active: safeAccount.is_active,
    },
  };
};

const authModel = { loginAccount };

export default authModel;
