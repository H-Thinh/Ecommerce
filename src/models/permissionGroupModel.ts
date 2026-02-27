import prisma from "../PrismaClient";
import { PermissionGroupType } from "../types/PermissionType";

const createPermissionGroup = async (data: PermissionGroupType) => {
  const maxSort = await prisma.permissionGroup.aggregate({
    _max: { sort_order: true },
  });

  const nextSortOrder = (maxSort._max.sort_order ?? 0) + 1;

  return prisma.permissionGroup.create({
    data: {
      ...data,
      sort_order: nextSortOrder,
    },
  });
};

const updatePermissionGroupById = async (
  id: number,
  data: Partial<PermissionGroupType>
) => await prisma.permissionGroup.update({ where: { id }, data });

const getPermissionGroups = async () => {
  const permissionGroups = await prisma.permissionGroup.findMany({
    include: {
      rolePermissionGroups: true,
      permissions: true,
      _count: {
        select: { permissions: true },
      },
    },
    orderBy: { sort_order: "asc" },
  });

  return permissionGroups.map(({ _count, ...rest }) => ({
    ...rest,
    permissionCount: _count.permissions,
  }));
};

const deletePermissionGroupById = async (id: number) =>
  await prisma.permissionGroup.delete({ where: { id } });

const getPermissionGroupById = async (id: number) =>
  await prisma.permissionGroup.findUnique({ where: { id } });

const checkName = async (name: string) =>
  await prisma.permissionGroup.findUnique({ where: { name } });

const checkNameExcludeId = async (name: string, id: number) =>
  await prisma.permissionGroup.findUnique({ where: { name, NOT: { id } } });

const checkLabel = async (label: string) =>
  await prisma.permissionGroup.findFirst({ where: { label } });

const checkLabelExcludeId = async (label: string, id: number) =>
  await prisma.permissionGroup.findFirst({ where: { label, NOT: { id } } });

const permissionGroupModel = {
  checkName,
  checkLabel,
  checkNameExcludeId,
  checkLabelExcludeId,
  getPermissionGroups,
  createPermissionGroup,
  getPermissionGroupById,
  deletePermissionGroupById,
  updatePermissionGroupById,
};

export default permissionGroupModel;
