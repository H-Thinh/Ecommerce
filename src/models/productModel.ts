import prisma from "../PrismaClient";
import CreateProductType from "../types/ProductType";
import ProductType, { ProductVariantType } from "../types/ProductType";
import { parseImageJson } from "../utils/parseImageJson";

const createProduct = async (data: CreateProductType) =>
  await prisma.product.create({
    data,
    include: {
      category: true,
      sale: true,
      status: true,
      variants: {
        include: {
          color: true,
          size: true,
        },
      },
    },
  });

const getAllProducts = async (search?: string) => {
  const keyword = search?.trim();

  const products = await prisma.product.findMany({
    where: keyword
      ? {
          name_product: {
            contains: keyword,
          },
        }
      : {},
    select: {
      name_product: true,
      id: true,
      image_url: true,
      price: true,
      slug: true,
      status: { select: { id: true, name: true, hex: true } },
      sale: { select: { discount_type: true, discount_value: true } },
      variants: {
        select: {
          stock: true,
        },
      },
      category: { select: { id: true, name_category: true } },
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products.map((product) => {
    const { name_product, category, status, variants, ...rest } = product;

    return {
      ...rest,
      name: name_product,
      category: {
        id: category?.id,
        name: category?.name_category,
      },
      status: {
        id: status?.id,
        name: status?.name,
        hex: status?.hex,
      },
      sumStock: variants.reduce((sum, v) => sum + v.stock, 0),
    };
  });
};

const getProductById = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name_product: true,
      categoryId: true,
      statusId: true,
      price: true,
      saleId: true,
      description: true,
      image_url: true,
      variants: { include: { color: true, size: true } },
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const { name_product, ...rest } = product;

  return { name: name_product, ...rest };
};

const updateProductById = async (id: number, data: Partial<ProductType>) =>
  await prisma.product.update({
    where: { id },
    data,
  });

const deleteProductById = async (id: number) =>
  await prisma.product.delete({
    where: { id },
  });

const getFeaturedProducts = async (sort: string = "newest") => {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name_product: true,
      description: true,
      image_url: true,
      slug: true,
      price: true,
      createdAt: true,
      category: { select: { name_category: true } },
      variants: {
        select: {
          id: true,
          image_url: true,
          color: { select: { id: true, hex: true, name_color: true } },
          size: { select: { id: true, Symbol: true } },
          stock: true,
        },
      },
      sale: {
        select: {
          discount_type: true,
          discount_value: true,
        },
      },
    },
    orderBy: { sold: "desc" },
    take: 10,
  });

  return products.map((pro) => {
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

    // ===== VARIANT MAP (🔥 QUAN TRỌNG) =====
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

    const { name_product, category, image_url, ...rest } = pro;

    const image = JSON.parse(image_url || "[]");

    return {
      ...rest,
      name: name_product,
      image_url: image[0],
      category: { name: category?.name_category },
      colors,
      sizes,

      // 🔥 FE chỉ cần dùng cái này
      variantMap: {
        colorToSizes,
        sizeToColors,
        colorImageMap,
      },
    };
  });
};

const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      id: true,
      name_product: true,
      description: true,
      image_url: true,
      price: true,
      reviews: { select: { rating: true, user: true, comment: true } },
      variants: {
        select: {
          id: true,
          image_url: true,
          color: { select: { id: true, hex: true, name_color: true } },
          size: { select: { id: true, Symbol: true } },
          stock: true,
        },
      },
      sale: { select: { discount_type: true, discount_value: true } },
      _count: { select: { variants: { where: { stock: { gt: 0 } } } } },
    },
  });

  if (!product) {
    throw new Error("Không có sản phẩm này!");
  }

  const productImages = parseImageJson(product.image_url);

  const variantImages = product.variants.flatMap((v) => v.image_url);

  const mergedImages = Array.from(
    new Set([...productImages, ...variantImages]),
  );

  const colorMap = new Map<number, any>();
  product.variants.forEach((v) => {
    if (!colorMap.has(v.color?.id || 0)) {
      colorMap.set(v.color?.id || 0, v.color);
    }
  });

  const colors = Array.from(colorMap.values());

  const sizeMap = new Map<number, any>();
  product.variants.forEach((v) => {
    if (!sizeMap.has(v.size?.id || 0)) {
      sizeMap.set(v.size?.id || 0, v.size);
    }
  });

  const sizes = Array.from(sizeMap.values());

  const ratingSummary = {
    total: product.reviews.length,
    average: 0,
    stars: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>,
  };

  let ratingSum = 0;
  product.reviews.forEach((r) => {
    ratingSummary.stars[r.rating]++;
    ratingSum += r.rating;
  });

  ratingSummary.average =
    ratingSummary.total > 0
      ? Number((ratingSum / ratingSummary.total).toFixed(1))
      : 0;

  // ---------- Return ----------
  return {
    id: product.id,
    name: product.name_product,
    description: product.description,
    price: product.price ?? 0,

    image_url: mergedImages,

    variants: product.variants,
    colors,
    sizes,

    sale: product.sale,
    ratingSummary,

    reviews: product.reviews.map(({ user, comment, ...rest }) => ({
      ...rest,
      username: user.name,
      avatar: user.avatar,
      content: comment,
    })),

    countStock: product._count.variants,
  };
};

const getSaleProducts = async () => {
  const products = await prisma.product.findMany({
    where: {
      sale: { isNot: null },
    },
    select: {
      id: true,
      name_product: true,
      description: true,
      image_url: true,
      slug: true,
      price: true,
      createdAt: true,

      category: { select: { name_category: true } },

      variants: {
        select: {
          id: true,
          image_url: true,
          color: { select: { id: true, hex: true, name_color: true } },
          size: { select: { id: true, Symbol: true } },
          stock: true,
        },
      },

      sale: {
        select: {
          discount_type: true,
          discount_value: true,
        },
      },
    },
  });

  return products.map((pro) => {
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

    const { name_product, category, image_url, ...rest } = pro;

    const image = JSON.parse(image_url || "[]");

    return {
      ...rest,
      name: name_product,
      image_url: image[0],
      category: { name: category?.name_category },

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

const createProductVariant = async (data: ProductVariantType) =>
  await prisma.productVariant.create({
    data,
    include: {
      color: true,
      size: true,
      product: true,
    },
  });

const updateProductVariantById = async (
  id: number,
  data: Partial<ProductVariantType>,
) =>
  await prisma.productVariant.update({
    where: { id },
    data,
    include: {
      color: true,
      size: true,
      product: true,
    },
  });

const deleteProductVariantById = async (id: number) =>
  await prisma.productVariant.delete({
    where: { id },
  });

const getProductVariants = async (productId: number) => {
  const variants = await prisma.productVariant.findMany({
    where: { productId },
    select: {
      id: true,
      image_url: true,
      color: { select: { hex: true, name_color: true } },
      size: { select: { Symbol: true } },
      stock: true,
    },
  });

  return variants.map((variant) => {
    const { color, size, ...rest } = variant;
    return {
      ...rest,
      name_color: color?.name_color,
      hex_color: color?.hex,
      symbol_size: size?.Symbol,
    };
  });
};

const getProductVariantsById = async (variantId: number) =>
  await prisma.productVariant.findUnique({
    where: { id: variantId },
  });

const updateProductStatusById = async (id: number, statusId: number) => {
  await prisma.product.update({ where: { id }, data: { statusId } });
};

const decreaseStockProductById = async (
  variantId: number,
  quantity: number,
) => {
  return await prisma.productVariant.update({
    where: { id: variantId },
    data: {
      stock: {
        decrement: quantity,
      },
      sold: {
        increment: quantity,
      },
    },
  });
};

const increaseStockProductById = async (
  variantId: number,
  quantity: number,
) => {
  return await prisma.productVariant.update({
    where: { id: variantId },
    data: {
      stock: {
        increment: quantity,
      },
      sold: {
        decrement: quantity,
      },
    },
  });
};

const createProductView = async (userId: number, productId: number) =>
  await prisma.productView.upsert({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    update: {
      viewedAt: new Date(),
      viewCount: { increment: 1 },
    },
    create: {
      userId,
      productId,
    },
  });

const getAllProductViewByUserId = async (userId: number) =>
  await prisma.productView.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { viewedAt: "desc" },
    take: 20,
  });

const searchProduct = async (keyword: string) => {
  const products = await prisma.product.findMany({
    where: {
      name_product: {
        contains: keyword,
      },
    },
    select: {
      id: true,
      name_product: true,
      image_url: true,
      price: true,
      category: { select: { name_category: true } },
      slug: true,
    },
  });

  return products.map((product) => {
    return {
      id: product.id,
      name: product.name_product,
      image_url: parseImageJson(product.image_url),
      price: product.price,
      slug: product.slug,
      categoryName: product.category?.name_category,
    };
  });
};

const productModel = {
  createProduct,
  searchProduct,
  getAllProducts,
  getProductById,
  getSaleProducts,
  getProductBySlug,
  createProductView,
  updateProductById,
  deleteProductById,
  getProductVariants,
  getFeaturedProducts,
  createProductVariant,
  getProductVariantsById,
  updateProductStatusById,
  updateProductVariantById,
  deleteProductVariantById,
  decreaseStockProductById,
  increaseStockProductById,
  getAllProductViewByUserId,
};

export default productModel;
