import prisma from "../PrismaClient";

import { CreateUserBankAccountType } from "../types/UserBankAccountType";

const createUserBankAccount = async (data: CreateUserBankAccountType) =>
  await prisma.userBankAccount.create({
    data,
  });

const togglePrimaryUserbankAccount = async (id: number, userId: number) => {
  return await prisma.$transaction([
    prisma.userBankAccount.updateMany({
      where: {
        userId,
        is_primary: true,
      },
      data: { is_primary: false },
    }),

    prisma.userBankAccount.update({
      where: { id },
      data: { is_primary: true },
    }),
  ]);
};

const getAllUserBankAccount = async (userId: number) =>
  await prisma.userBankAccount.findMany({
    where: { userId },
    orderBy: {
      is_primary: "desc",
    },
  });

const userBankAccountModel = {
  createUserBankAccount,
  getAllUserBankAccount,
  togglePrimaryUserbankAccount,
};

export default userBankAccountModel;
