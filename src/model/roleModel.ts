import prisma from "../PrismaClient";
import RoleType from "../type/RoleType";

const createRole = async (data: RoleType) => {
  return await prisma.role.create({ data });
};

const getRoles = async () => {
  return await prisma.role.findMany();
};

const updateRoleById = async (id: number, data: Partial<RoleType>) => {
  return await prisma.role.update({ where: { id }, data });
};

const deleteRoleById = async (id: number) => {
  return await prisma.role.delete({ where: { id } });
};

const findRoleById = async (id: number) => {
  return await prisma.role.findUnique({ where: { id } });
};

const roleModel = {
  getRoles,
  createRole,
  findRoleById,
  updateRoleById,
  deleteRoleById,
};

export default roleModel;
