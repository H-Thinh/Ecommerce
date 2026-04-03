import prisma from "../PrismaClient";

import CategoryType from "../types/CategoryType";

const createCategory = async (data: CategoryType) =>
  await prisma.category.create({ data });

const updateCategoryById = async (id: number, data: Partial<CategoryType>) =>
  await prisma.category.update({ where: { id }, data });

const deleteCategoryById = async (id: number) =>
  await prisma.category.delete({ where: { id } });

const getCategories = async (search?: string) => {
  const categories = await prisma.category.findMany({
    where: search
      ? {
          name_category: {
            contains: search,
          },
        }
      : {},
  });

  return categories.map(({ name_category, image_category, ...rest }) => ({
    ...rest,
    name: name_category,
    imageCategory: image_category,
  }));
};

const getCategoryById = async (id: number) =>
  await prisma.category.findUnique({ where: { id } });

const checkName = async (name: string) => {
  const existingName = await prisma.category.findFirst({
    where: { name_category: name },
  });

  return !!existingName;
};

const checkNameExcludeId = async (name: string, id: number) => {
  const existingName = await prisma.category.findFirst({
    where: { name_category: name, NOT: { id } },
  });

  return !!existingName;
};

const getProductBySlugCategory = async (slug: string) => {
  const categoryWithProduct = await prisma.category.findUnique({
    where: { slug },
    select: {
      products: {
        select: {
          id: true,
          name_product: true,
          image_url: true,
          slug: true,
          price: true,
          createdAt: true,

          status: {
            select: { id: true, name: true, hex: true },
          },

          category: {
            select: { id: true, name_category: true },
          },

          sale: {
            select: {
              discount_type: true,
              discount_value: true,
            },
          },

          variants: {
            select: {
              id: true,
              image_url: true,
              stock: true,
              color: {
                select: { id: true, hex: true, name_color: true },
              },
              size: {
                select: { id: true, Symbol: true },
              },
            },
          },
        },
      },
    },
  });

  return categoryWithProduct?.products.map((pro) => {
    // ===== COLORS =====
    const colorMap = new Map<number, any>();
    pro.variants.forEach((v) => {
      if (v.color && !colorMap.has(v.color.id)) {
        colorMap.set(v.color.id, v.color);
      }
    });
    const colors = Array.from(colorMap.values());

    // ===== SIZES =====
    const sizeMap = new Map<number, any>();
    pro.variants.forEach((v) => {
      if (v.size && !sizeMap.has(v.size.id)) {
        sizeMap.set(v.size.id, v.size);
      }
    });
    const sizes = Array.from(sizeMap.values());

    // ===== VARIANT MAP =====
    const colorToSizes: Record<number, number[]> = {};
    const sizeToColors: Record<number, number[]> = {};
    const colorImageMap: Record<number, string> = {};

    pro.variants.forEach((v) => {
      const c = v.color?.id;
      const s = v.size?.id;

      if (!c || !s) return;

      // color -> sizes
      if (!colorToSizes[c]) colorToSizes[c] = [];
      if (!colorToSizes[c].includes(s)) {
        colorToSizes[c].push(s);
      }

      // size -> colors
      if (!sizeToColors[s]) sizeToColors[s] = [];
      if (!sizeToColors[s].includes(c)) {
        sizeToColors[s].push(c);
      }

      // color -> image
      if (!colorImageMap[c]) {
        colorImageMap[c] = v.image_url || "";
      }
    });

    const { name_product, category, status, image_url, variants, ...rest } =
      pro;

    const image = JSON.parse(image_url || "[]");

    return {
      ...rest,
      name: name_product,
      image_url: image[0],

      category: {
        id: category?.id,
        name: category?.name_category,
      },

      status: {
        id: status?.id,
        name: status?.name,
        hex: status?.hex,
      },

      variants: pro.variants,

      sumStock: variants.reduce((sum, v) => sum + v.stock, 0),

      colors,
      sizes,

      variantMap: {
        colorToSizes,
        sizeToColors,
        colorImageMap,
      },
    };
  });
};

const searchCategory = async (nameCategory: string) => {
  const categories = await prisma.category.findMany({
    where: { name_category: { contains: nameCategory } },
  });

  return categories.map((category) => {
    const { name_category, image_category, ...rest } = category;
    return { ...rest, name: name_category, imageCategory: image_category };
  });
};
const categoryModel = {
  checkName,
  getCategories,
  searchCategory,
  createCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  checkNameExcludeId,
  getProductBySlugCategory,
};

export default categoryModel;
