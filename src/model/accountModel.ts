import prisma from "../PrismaClient";
import AccountType from "../type/AccountType";

const createAccount = async (data: AccountType) =>
  await prisma.account.create({ data });

const updateAccountById = async (id: number, data: Partial<AccountType>) =>
  await prisma.account.update({ where: { id }, data });

const getAccounts = async () => await prisma.account.findMany();

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

const accountModel = {
  checkName,
  checkEmail,
  getAccounts,
  createAccount,
  findAccountById,
  updateAccountById,
  deleteAccountById,
  checkNameExcludeId,
  checkEmailExcludeId,
};

export default accountModel;
