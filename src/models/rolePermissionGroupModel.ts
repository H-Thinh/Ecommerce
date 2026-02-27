import prisma from "../PrismaClient";

const assignPermissionGroupToRole = async (data: {
  roleId: number;
  permissionGroupId: number;
  is_enabled: boolean;
}) => {
  return prisma.rolePermissionGroup.upsert({
    where: {
      roleId_permissionGroupId: {
        roleId: data.roleId,
        permissionGroupId: data.permissionGroupId,
      },
    },
    update: { is_enabled: data.is_enabled },
    create: data,
  });
};

const getRolePermissionGroups = async (roleId: number) => {
  return prisma.rolePermissionGroup.findMany({
    where: { roleId },
    select: { permissionGroupId: true, is_enabled: true },
  });
};

const getAllRolesWithPermissionGroups = async () => {
  return prisma.role.findMany({
    include: {
      rolePermissionGroups: {
        include: {
          permissionGroup: true,
        },
      },
    },
  });
};

const updateRolePermissionGroup = async (
  roleId: number,
  permissionGroupId: number,
  is_enabled: boolean
) => {
  return prisma.rolePermissionGroup.update({
    where: {
      roleId_permissionGroupId: { roleId, permissionGroupId },
    },
    data: { is_enabled },
  });
};

const removePermissionGroupFromRole = async (
  roleId: number,
  permissionGroupId: number
) => {
  return prisma.rolePermissionGroup.delete({
    where: {
      roleId_permissionGroupId: { roleId, permissionGroupId },
    },
  });
};

const checkRolePermissionGroupExists = async (
  roleId: number,
  permissionGroupId: number
) => {
  return prisma.rolePermissionGroup.findUnique({
    where: {
      roleId_permissionGroupId: { roleId, permissionGroupId },
    },
  });
};

const rolePermissionGroupModel = {
  getRolePermissionGroups,
  updateRolePermissionGroup,
  assignPermissionGroupToRole,
  removePermissionGroupFromRole,
  checkRolePermissionGroupExists,
  getAllRolesWithPermissionGroups,
};

export default rolePermissionGroupModel;
