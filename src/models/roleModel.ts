import prisma from "../PrismaClient";
import RoleType from "../types/RoleType";

const createRole = async (data: RoleType) => {
  return await prisma.$transaction(async (tx) => {
    const role = await tx.role.create({
      data: {
        name_role: data.name_role,
        description: data.description,
      },
    });

    const permissions = await tx.permission.findMany({
      where: {
        id: { in: data.permissions },
      },
      select: { id: true, name: true, groupId: true },
    });

    await tx.rolePermission.createMany({
      data: permissions.map((p) => ({
        roleId: role.id,
        permissionId: p.id,
      })),
    });

    const groupIds = [...new Set(permissions.map((p) => p.groupId))];

    const allGroups = await tx.permissionGroup.findMany({
      select: { id: true },
    });

    const enabledGroupSet = new Set(groupIds);

    await tx.rolePermissionGroup.createMany({
      data: allGroups.map((group) => ({
        roleId: role.id,
        permissionGroupId: group.id,
        is_enabled: enabledGroupSet.has(group.id),
      })),
    });

    return { ...role, permissions: permissions.map((per) => per.name) };
  });
};

const getRoles = async () => {
  const roles = await prisma.role.findMany({
    include: {
      _count: { select: { accounts: true } },
    },
  });

  return roles.map(({ _count, name_role, ...rest }) => ({
    ...rest,
    name: name_role,
    roleCount: _count.accounts,
  }));
};

const updateRoleById = async (id: number, data: Partial<RoleType>) => {
  return await prisma.role.update({ where: { id }, data });
};

const deleteRoleById = async (id: number) => {
  return await prisma.role.delete({ where: { id } });
};

const getRoleById = async (id: number) => {
  const role = await prisma.role.findUnique({
    where: { id },
    include: {
      rolePermissions: { select: { permissionId: true } },
    },
  });

  if (!role) return null;

  const { rolePermissions, name_role, ...rest } = role;
  return {
    ...rest,
    name: name_role,
    permissions: rolePermissions.map((per) => per.permissionId),
  };
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

const roleModel = {
  getRoles,
  checkName,
  createRole,
  getRoleById,
  updateRoleById,
  deleteRoleById,
  checkNameExcludeId,
};

export default roleModel;
