import prisma from "../PrismaClient";
import { CreateUserType, UpdateUserType } from "../types/UserType";

const createUser = async (data: CreateUserType) =>
  await prisma.user.create({
    data,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      points: true,
      avatar: true,
      is_active: true,
      is_verifyEmail: true,
      createdAt: true,
      updatedAt: true,
    },
  });

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      points: true,
      avatar: true,
      is_active: true,
      is_verifyEmail: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { orders: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users.map((user) => {
    const { _count, ...rest } = user;
    return { ...rest, countOrder: _count.orders };
  });
};

const getUserById = async (id: number) =>
  await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      points: true,
      avatar: true,
      is_active: true,
      pointHistory: true,
    },
  });

const getUserByEmail = async (email: string) =>
  await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      phone: true,
      address: true,
      points: true,
      avatar: true,
      is_active: true,
      is_verifyEmail: true,
      createdAt: true,
      updatedAt: true,
    },
  });

const getUserByName = async (name: string) =>
  await prisma.user.findFirst({
    where: { name },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      phone: true,
      address: true,
      points: true,
      avatar: true,
      is_active: true,
      is_verifyEmail: true,
      createdAt: true,
      updatedAt: true,
    },
  });

const updateUserById = async (id: number, data: UpdateUserType) =>
  await prisma.user.update({
    where: { id },
    data: {
      address: data.address,
      avatar: data.avatar,
      email: data.email,
      name: data.name,
      phone: data.phone,
      points: { increment: Number(data.points) },
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      points: true,
      avatar: true,
    },
  });

const deleteUserById = async (id: number) =>
  await prisma.user.delete({
    where: { id },
  });

const updateUserPoints = async (id: number, points: number) =>
  await prisma.user.update({
    where: { id },
    data: {
      points: { increment: points },
    },
    select: {
      id: true,
      name: true,
      points: true,
    },
  });

const checkNameExcludeId = async (name: string, id: number) =>
  await prisma.user.findFirst({ where: { name, NOT: { id } } });

const searchUser = async (nameUser: string) =>
  await prisma.user.findMany({
    where: { name: { contains: nameUser } },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      phone: true,
      address: true,
      points: true,
      avatar: true,
      is_active: true,
      is_verifyEmail: true,
      createdAt: true,
      updatedAt: true,
    },
  });

const getTotalUsers = async (startDate: Date, endDate: Date) => {
  const result = await prisma.user.aggregate({
    _count: true,
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return result._count;
};

const userModel = {
  createUser,
  searchUser,
  getAllUsers,
  getUserById,
  getTotalUsers,
  getUserByName,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  updateUserPoints,
  checkNameExcludeId,
};

export default userModel;
