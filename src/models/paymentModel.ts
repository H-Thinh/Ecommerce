import prisma from "../PrismaClient";
import { CreatePaymentType, UpdatePaymentType } from "../types/PaymentType";

const createPayment = async (data: CreatePaymentType) => {
  return await prisma.payment.create({
    data,
    include: {
      order: {
        select: {
          id: true,
          userId: true,
          total_price: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      method: true,
    },
  });
};

const getAllPayments = async () => {
  return await prisma.payment.findMany({
    include: {
      order: {
        select: {
          id: true,
          userId: true,
          total_price: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      method: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getPaymentById = async (id: number) => {
  return await prisma.payment.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                  color: true,
                  size: true,
                },
              },
            },
          },
        },
      },
      method: true,
    },
  });
};

const getPaymentByOrderId = async (orderId: number) => {
  return await prisma.payment.findFirst({
    where: { orderId },
    select: { id: true, status: true, amount: true },
  });
};

const getPaymentsByStatus = async (
  status: "pending" | "processing" | "success" | "failed" | "refunded",
) => {
  return await prisma.payment.findMany({
    where: { status },
    include: {
      order: {
        select: {
          id: true,
          userId: true,
          total_price: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      method: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updatePaymentById = async (id: number, data: UpdatePaymentType) => {
  return await prisma.payment.update({
    where: { id },
    data,
    include: {
      order: {
        select: {
          id: true,
          userId: true,
          total_price: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      method: true,
    },
  });
};

const deletePaymentById = async (id: number) => {
  return await prisma.payment.delete({
    where: { id },
  });
};

const paymentModel = {
  createPayment,
  getAllPayments,
  getPaymentById,
  getPaymentByOrderId,
  getPaymentsByStatus,
  updatePaymentById,
  deletePaymentById,
};

export default paymentModel;
