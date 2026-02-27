import prisma from "../PrismaClient";
import AccountType from "../types/AccountType";

const createAccount = async (data: AccountType) =>
  await prisma.account.create({ data });

const updateAccountById = async (id: number, data: Partial<AccountType>) =>
  await prisma.account.update({ where: { id }, data });

const getAccounts = async () => {
  const account = await prisma.account.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      avatar: true,
      is_active: true,
      createdAt: true,
      updatedAt: true,
      role: { select: { name_role: true } },
    },
  });

  if (!account) return null;

  return account.map((ac) => {
    const { role, ...rest } = ac;
    return { ...rest, nameRole: role.name_role };
  });
};

const deleteAccountById = async (id: number) =>
  await prisma.account.delete({ where: { id } });

const findAccountById = async (id: number) => {
  const existingAccount = await prisma.account.findUnique({
    where: { id },
  });

  return !!existingAccount;
};

const checkEmail = async (email: string) => {
  const existingEmail = await prisma.account.findUnique({ where: { email } });

  return !!existingEmail;
};

const checkName = async (name: string) => {
  const existingName = await prisma.account.findFirst({ where: { name } });

  return !!existingName;
};

const checkEmailExcludeId = async (email: string, id: number) => {
  const existingEmail = await prisma.account.findFirst({
    where: { email, NOT: { id } },
  });

  return !!existingEmail;
};

const checkNameExcludeId = async (name: string, id: number) => {
  const existingName = await prisma.account.findFirst({
    where: { name, NOT: { id } },
  });

  return !!existingName;
};

const getAccountById = async (id: number) => {
  const account = await prisma.account.findUnique({ where: { id } });

  if (!account) {
    return null;
  }

  const { password, ...safeAccount } = account;

  return safeAccount;
};

const accountModel = {
  checkName,
  checkEmail,
  getAccounts,
  createAccount,
  getAccountById,
  findAccountById,
  updateAccountById,
  deleteAccountById,
  checkNameExcludeId,
  checkEmailExcludeId,
};

export default accountModel;
