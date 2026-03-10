import prisma from "../PrismaClient";
import {
  CreateOrderStatusType,
  UpdateOrderStatusType,
} from "../types/OrderStatusType";

const createOrderStatus = async (data: CreateOrderStatusType) =>
  await prisma.orderStatus.create({
    data,
  });

const getAllOrderStatuses = async () => {
  const orderStatuses = await prisma.orderStatus.findMany({
    select: {
      id: true,
      name: true,
      hex: true,
      code: true,
      description: true,
      _count: { select: { orders: true } },
    },
    orderBy: [{ sort_order: "asc" }, { createdAt: "asc" }],
  });

  return orderStatuses.map((orderS) => {
    const { _count, ...rest } = orderS;
    return { ...rest, countNumber: _count.orders };
  });
};

const getOrderStatusById = async (id: number) =>
  await prisma.orderStatus.findUnique({
    where: { id },
  });

const getOrderStatusByCode = async (code: string) =>
  await prisma.orderStatus.findUnique({
    where: { code },
  });

const getOrderStatusByName = async (name: string) =>
  await prisma.orderStatus.findUnique({
    where: { name },
  });

const updateOrderStatusById = async (id: number, data: UpdateOrderStatusType) =>
  await prisma.orderStatus.update({
    where: { id },
    data,
  });

const deleteOrderStatusById = async (id: number) =>
  await prisma.orderStatus.delete({
    where: { id },
  });

const orderStatusModel = {
  createOrderStatus,
  getAllOrderStatuses,
  getOrderStatusById,
  getOrderStatusByCode,
  getOrderStatusByName,
  updateOrderStatusById,
  deleteOrderStatusById,
};

export default orderStatusModel;
