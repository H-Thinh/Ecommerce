import prisma from "../PrismaClient";
import ProductStatusType from "../types/ProductStatusType";

const createProductStatus = async (data: ProductStatusType) => {
  return await prisma.productStatus.create({
    data,
  });
};

const getAllProductStatuses = async () => {
  const productStatuses = await prisma.productStatus.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return productStatuses.map((productS) => {
    const { _count, ...rest } = productS;

    return { ...rest, countNumber: _count.products };
  });
};

const getProductStatusById = async (id: number) => {
  return await prisma.productStatus.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
};
const getProductStatusByName = async (name: string) => {
  return await prisma.productStatus.findUnique({
    where: { name },
  });
};

const updateProductStatusById = async (
  id: number,
  data: Partial<ProductStatusType>,
) => {
  return await prisma.productStatus.update({
    where: { id },
    data,
  });
};

const deleteProductStatusById = async (id: number) => {
  return await prisma.productStatus.delete({
    where: { id },
  });
};

const productStatusModel = {
  createProductStatus,
  getAllProductStatuses,
  getProductStatusById,
  getProductStatusByName,
  updateProductStatusById,
  deleteProductStatusById,
};

export default productStatusModel;
