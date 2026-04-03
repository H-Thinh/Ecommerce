import prisma from "../PrismaClient";

import SizeType from "../types/SizeType";

const createSize = async (data: SizeType) => await prisma.size.create({ data });

const getSizes = async () => {
  const sizes = await prisma.size.findMany();

  return sizes.map((size) => {
    const { Symbol, name_size, id } = size;
    return { id, name: name_size, symbol: Symbol };
  });
};

const updateSizeById = async (id: number, data: Partial<SizeType>) =>
  await prisma.size.update({ where: { id }, data });

const deleteSizeById = async (id: number) =>
  await prisma.size.delete({ where: { id } });

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

const findSizeById = async (id: number) => {
  const existingSize = await prisma.size.findUnique({
    where: { id },
  });

  return !!existingSize;
};

const sizeModel = {
  getSizes,
  checkName,
  createSize,
  findSizeById,
  updateSizeById,
  deleteSizeById,
  checkNameExcludeId,
};

export default sizeModel;
