import prisma from "../PrismaClient";
import { CreatePointRule, UpdatePointRule } from "../types/PointRuleType";

const createPointRule = async (data: CreatePointRule) =>
  await prisma.pointRule.create({ data });

const getAllPointRules = async () => {
  const pointRules = await prisma.pointRule.findMany({
    where: { is_active: true },
  });

  return pointRules.map((pointRule) => {
    const { required_points, ...rest } = pointRule;
    return { ...rest, point: required_points };
  });
};

const getPointRuleById = async (id: number) =>
  await prisma.pointRule.findUnique({ where: { id } });

const updatePointRuleById = async (id: number, data: UpdatePointRule) =>
  await prisma.pointRule.update({ where: { id }, data });

const deletePointRuleById = async (id: number) =>
  await prisma.pointRule.delete({ where: { id } });

const checkPoint = async (point: number) => {
  const pointExist = await prisma.pointRule.findFirst({
    where: { required_points: point },
  });

  return !!pointExist;
};

const toggleActivePointRule = async (id: number) => {
  const pointRule = await prisma.pointRule.findUnique({
    where: { id },
    select: { is_active: true },
  });

  if (!pointRule) {
    throw new Error("PointRule not found");
  }

  return prisma.pointRule.update({
    where: { id },
    data: {
      is_active: !pointRule.is_active,
    },
  });
};

const pointRuleModel = {
  checkPoint,
  createPointRule,
  getAllPointRules,
  getPointRuleById,
  updatePointRuleById,
  deletePointRuleById,
  toggleActivePointRule,
};

export default pointRuleModel;
