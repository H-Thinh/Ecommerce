import prisma from "../PrismaClient";
import SaleType from "../types/SaleType";

const createSale = async (data: SaleType) => {
  return await prisma.sale.create({
    data,
  });
};

const getAllSales = async (search?: string) => {
  const sales = await prisma.sale.findMany({
    where: search
      ? {
          name_sale: {
            contains: search,
          },
        }
      : {},
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return sales.map(({ name_sale, ...rest }) => ({
    ...rest,
    name: name_sale,
  }));
};

const getActiveSales = async () => {
  const now = new Date();
  return await prisma.sale.findMany({
    where: {
      is_active: true,
      OR: [
        {
          start_date: null,
          end_date: null,
        },
        {
          start_date: { lte: now },
          end_date: { gte: now },
        },
        {
          start_date: { lte: now },
          end_date: null,
        },
        {
          start_date: null,
          end_date: { gte: now },
        },
      ],
    },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
};

const getSaleById = async (id: number) => {
  return await prisma.sale.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
};

const updateSaleById = async (id: number, data: Partial<SaleType>) => {
  return await prisma.sale.update({
    where: { id },
    data,
  });
};

const deleteSaleById = async (id: number) => {
  return await prisma.sale.delete({
    where: { id },
  });
};

const saleModel = {
  createSale,
  getAllSales,
  getActiveSales,
  getSaleById,
  updateSaleById,
  deleteSaleById,
};

export default saleModel;
