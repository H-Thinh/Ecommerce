import prisma from "../PrismaClient";
import ColorType from "../types/ColorType";

const createColor = async (data: ColorType) =>
  await prisma.color.create({ data });

const updateColorById = async (id: number, data: Partial<ColorType>) =>
  await prisma.color.update({ where: { id }, data });

const deleteColorById = async (id: number) =>
  await prisma.color.delete({ where: { id } });

const getColors = async () => {
  const colors = await prisma.color.findMany();

  return colors.map((color) => {
    const { name_color, ...rest } = color;
    return { ...rest, name: name_color };
  });
};

const findColorById = async (id: number) => {
  const existingColor = await prisma.color.findUnique({
    where: { id },
  });

  return !!existingColor;
};

const checkName = async (name: string) => {
  const existingName = await prisma.color.findFirst({
    where: { name_color: name },
  });

  return !!existingName;
};

const checkNameExcludeId = async (name: string, id: number) => {
  const existingName = await prisma.color.findFirst({
    where: { name_color: name, NOT: { id } },
  });

  return !!existingName;
};

const checkHex = async (hex: string) => {
  const existingHex = await prisma.color.findFirst({
    where: { hex },
  });

  return !!existingHex;
};

const checkHexExcludeId = async (hex: string, id: number) => {
  const existingHex = await prisma.color.findFirst({
    where: { hex, NOT: { id } },
  });

  return !!existingHex;
};

const colorModel = {
  checkHex,
  getColors,
  checkName,
  createColor,
  findColorById,
  deleteColorById,
  updateColorById,
  checkHexExcludeId,
  checkNameExcludeId,
};

export default colorModel;
