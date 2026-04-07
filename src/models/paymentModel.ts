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
  const payment = await prisma.payment.findUnique({
    where: { id },
    // include: {
    //   order: {
    //     include: {
    //       user: {
    //         select: {
    //           id: true,
    //           name: true,
    //           email: true,
    //           phone: true,
    //         },
    //       },
    //       items: {
    //         include: {
    //           variant: {
    //             include: {
    //               product: true,
    //               color: true,
    //               size: true,
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    //   method: true,
    // },
  });

  if (!payment) {
    throw new Error("Payment not founded");
  }

  return payment;
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
    data: {
      ...data,
      received_at: new Date(),
    },
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

const confirmCodPaymentReceived = async (id: number, adminId: number) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status === "success") {
    throw new Error("Payment already confirmed");
  }

  return await prisma.payment.update({
    where: { id },
    data: {
      status: "success",
      collectedByAdminId: adminId,
      received_at: new Date(),
    },
  });
};

const getRevenueByDate = async (startDate: Date, endDate: Date) => {
  const result = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: "success",
      received_at: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return result._sum.amount || 0;
};

const paymentModel = {
  createPayment,
  getAllPayments,
  getPaymentById,
  getRevenueByDate,
  updatePaymentById,
  deletePaymentById,
  getPaymentByOrderId,
  getPaymentsByStatus,
  confirmCodPaymentReceived,
};

export default paymentModel;
