import prisma from "../PrismaClient";
import PermissionType from "../types/PermissionType";

const createPermission = async (data: PermissionType) =>
  await prisma.permission.create({
    data: {
      name: data.name,
      description: data.description,
      groupId: data.groupId,
      label: data.label,
    },
  });

const updatePermissionById = async (
  id: number,
  data: Partial<PermissionType>,
) => await prisma.permission.update({ where: { id }, data });

const deletePermissionById = async (id: number) =>
  await prisma.permission.delete({ where: { id } });

const getPermissions = async (search?: string) => {
  return await prisma.permission.findMany({
    where: search
      ? {
          label: {
            contains: search,
          },
        }
      : {},
  });
};

const getPermissionById = async (id: number) =>
  await prisma.permission.findUnique({
    where: { id },
  });

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
  getPermissionById,
  checkNameExcludeId,
  updatePermissionById,
  deletePermissionById,
};

export default permissionModel;
