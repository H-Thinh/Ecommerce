import prisma from "../PrismaClient";

import { CreateSizeGuide, UpdateSizeGuide } from "../types/SizeGuidetype";

const createSizeGuide = async (data: CreateSizeGuide) => {
  let sizeGuide = await prisma.sizeGuide.findFirst({
    where: {
      categoryId: data.categoryId,
      sizeId: data.sizeId,
    },
  });

  if (!sizeGuide) {
    sizeGuide = await prisma.sizeGuide.create({
      data: {
        categoryId: data.categoryId,
        sizeId: data.sizeId,
      },
    });
  }

  const sizeMeasurement = await prisma.sizeMeasurement.create({
    data: {
      sizeGuideId: sizeGuide.id,
      measurementTypeId: data.measurementId,
      min: data.min,
      max: data.max,
    },
  });

  return sizeMeasurement;
};

const updateSizeGuideById = async (
  sizeGuideId: number,
  sizeMeasurementId: number,
  data: UpdateSizeGuide,
) => {
  return await prisma.$transaction(async (tx) => {
    const sizeGuide = await tx.sizeGuide.update({
      where: { id: sizeGuideId },
      data: {
        categoryId: data.categoryId,
        sizeId: data.sizeId,
      },
    });

    const sizeMeasurement = await tx.sizeMeasurement.update({
      where: {
        id: sizeMeasurementId,
        sizeGuideId: sizeGuideId,
      },
      data: {
        min: data.min,
        max: data.max,
        measurementTypeId: data.measurementId,
      },
    });

    return {
      sizeGuide,
      sizeMeasurement,
    };
  });
};

const getSizeGuideByCategory = async (categoryId: number) => {
  const data = await prisma.sizeGuide.findMany({
    where: { categoryId },
    include: {
      size: {
        select: {
          id: true,
          Symbol: true,
        },
      },
      measurements: {
        include: {
          measurementType: {
            select: {
              id: true,
              name: true,
              unit: true,
            },
          },
        },
      },
    },
    orderBy: {
      sizeId: "asc",
    },
  });

  const result: Record<string, any> = {};
  const sizes: string[] = [];

  data.forEach((item) => {
    const sizeSymbol = item.size.Symbol;

    if (!sizes.includes(sizeSymbol)) {
      sizes.push(sizeSymbol);
    }

    item.measurements.forEach((m) => {
      const measurementName = `${m.measurementType.name} (${m.measurementType.unit})`;

      if (!result[measurementName]) {
        result[measurementName] = {
          measurementType: measurementName,
        };
      }

      result[measurementName][sizeSymbol] = `${m.min} - ${m.max}`;
    });
  });

  return {
    sizes,
    data: Object.values(result),
  };
};

const getSizeGuideById = async (
  sizeGuideId: number,
  sizeMeasurementId: number,
) => {
  return await prisma.sizeGuide.findFirst({
    where: {
      id: sizeGuideId,
      measurements: {
        some: {
          id: sizeMeasurementId,
        },
      },
    },
    include: {
      size: true,
      category: true,
      measurements: {
        where: {
          id: sizeMeasurementId,
        },
        include: {
          measurementType: true,
        },
      },
    },
  });
};

const sizeGuideModel = {
  createSizeGuide,
  getSizeGuideById,
  updateSizeGuideById,
  getSizeGuideByCategory,
};

export default sizeGuideModel;
