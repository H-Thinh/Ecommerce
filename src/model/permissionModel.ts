import prisma from "../PrismaClient";
import PermissionType from "../type/PermissionType";

const createPermission = async (data: PermissionType) =>
  await prisma.permission.create({ data });

const updatePermissionById = async (id: number, data: PermissionType) =>
  await prisma.permission.update({ where: { id }, data });

const deletePermissionById = async (id: number) =>
  await prisma.permission.delete({ where: { id } });

const getPermissions = async () => await prisma.permission.findMany();

const findPermissionById = async (id: number) => {
  const existingPermission = await prisma.permission.findUnique({
    where: { id },
  });

  return !!existingPermission;
};

const checkName = async (name: string) => {
  const existingName = await prisma.permission.findFirst({ where: { name } });

  return !!existingName;
};

const checkNameExcludeId = async (name: string, id: number) => {
  const existingName = await prisma.permission.findFirst({
    where: { name, NOT: { id } },
  });

  return !!existingName;
};

const permissionModel = {
  checkName,
  getPermissions,
  createPermission,
  findPermissionById,
  checkNameExcludeId,
  updatePermissionById,
  deletePermissionById,
};

export default permissionModel;
