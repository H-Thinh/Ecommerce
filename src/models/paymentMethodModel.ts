import prisma from "../PrismaClient";
import {
  CreatePaymentMethodType,
  UpdatePaymentMethodType,
} from "../types/PaymentMethodType";

const createPaymentMethod = async (data: CreatePaymentMethodType) =>
  await prisma.paymentMethod.create({
    data,
  });

const getAllPaymentMethods = async () =>
  await prisma.paymentMethod.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

const getActivePaymentMethods = async () =>
  await prisma.paymentMethod.findMany({
    where: { is_active: true },
    orderBy: {
      name: "asc",
    },
  });

const getPaymentMethodById = async (id: number) =>
  await prisma.paymentMethod.findUnique({
    where: { id },
  });

const getPaymentMethodByCode = async (code: string) => {
  const method = await prisma.paymentMethod.findUnique({
    where: { code },
  });

  if (!method) {
    throw new Error("Payment method not found");
  }

  return method;
};

const updatePaymentMethodById = async (
  id: number,
  data: UpdatePaymentMethodType,
) =>
  await prisma.paymentMethod.update({
    where: { id },
    data,
  });

const deletePaymentMethodById = async (id: number) =>
  await prisma.paymentMethod.delete({
    where: { id },
  });

const toggleActivePaymentMethood = async (id: number) => {
  const paymentMethood = await prisma.paymentMethod.findUnique({
    where: { id },
  });

  if (!paymentMethood) {
    throw new Error("PaymentMethood not found");
  }

  return prisma.paymentMethod.update({
    where: { id },
    data: { is_active: !paymentMethood.is_active },
  });
};

const paymentMethodModel = {
  createPaymentMethod,
  getAllPaymentMethods,
  getPaymentMethodById,
  getPaymentMethodByCode,
  getActivePaymentMethods,
  updatePaymentMethodById,
  deletePaymentMethodById,
  toggleActivePaymentMethood,
};

export default paymentMethodModel;
