import prisma from "../PrismaClient";

import { CreateMeasurement, UpdateMeasurement } from "../types/MeasurementType";
const createMeasurement = async (data: CreateMeasurement) =>
  await prisma.measurementType.create({
    data,
  });

const checkName = async (name: string) =>
  await prisma.measurementType.findUnique({ where: { name } });

const getMeasurementById = async (id: number) =>
  await prisma.measurementType.findUnique({ where: { id } });

const getAllMeasurement = async () => await prisma.measurementType.findMany();

const updateMeasurementById = async (id: number, data: UpdateMeasurement) =>
  prisma.measurementType.update({
    where: { id },
    data,
  });

const deleteMeasurementById = async (id: number) =>
  await prisma.measurementType.delete({
    where: { id },
  });

const measurementModel = {
  checkName,
  createMeasurement,
  getAllMeasurement,
  getMeasurementById,
  updateMeasurementById,
  deleteMeasurementById,
};

export default measurementModel;
