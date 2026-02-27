import prisma from "../PrismaClient";
import CartType from "../types/CartType";

const createCart = async (userId: number) =>
  await prisma.cart.create({ data: { userId } });

const addProductToCart = async (data: CartType) => {
  // Check if item already exists
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: data.cartId,
      variantId: data.variantId,
    },
  });

  if (existingItem) {
    // Update quantity if item exists
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + data.quantity },
    });
  }

  // Create new item if not exists
  return await prisma.cartItem.create({ data });
};

const removeProductToCart = async (cartId: number, variantId: number) => {
  const item = await prisma.cartItem.findFirst({
    where: { cartId, variantId },
  });

  if (!item) {
    return false;
  }

  return prisma.cartItem.delete({
    where: { id: item.id },
  });
};

const getProductsToCart = async (cartId: number, userId: number) => {
  const cart = await prisma.cart.findUnique({
    where: { id: cartId, userId },
    select: {
      items: {
        select: {
          quantity: true,
          variant: {
            select: {
              id: true,
              image_url: true,
              size: { select: { Symbol: true } },
              color: { select: { name_color: true } },
              product: {
                select: {
                  id: true,
                  name_product: true,
                  price: true,
                  sale: {
                    select: {
                      discount_type: true,
                      discount_value: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const items =
    cart?.items.map((i) => ({
      variantId: i.variant.id,
      quantity: i.quantity,
      productId: i.variant.product.id,
      size: i.variant.size?.Symbol,
      color: i.variant.color?.name_color,
      image_url: i.variant.image_url,
      name: i.variant.product.name_product,
      price: i.variant.product.price,
      sale: i.variant.product.sale,
      isChecked: false,
    })) || [];

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    totalQuantity,
    items,
    voucher: null,
  };
};

const findCartByUserId = async (userId: number) =>
  await prisma.cart.findUnique({ where: { userId } });

const increaseQuantity = async (cartId: number, variantId: number) => {
  const item = await prisma.cartItem.findFirst({
    where: { cartId, variantId },
    include: { variant: true },
  });

  if (!item) throw new Error("Item không tồn tại");

  // Check stock
  if (item.quantity >= item.variant.stock) {
    throw new Error("Không đủ hàng trong kho");
  }

  return prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity: { increment: 1 } },
  });
};

const decreaseQuantity = async (cartId: number, variantId: number) => {
  const item = await prisma.cartItem.findFirst({
    where: { cartId, variantId },
  });

  if (!item) throw new Error("Item không tồn tại");

  if (item.quantity <= 1) {
    return prisma.cartItem.delete({ where: { id: item.id } });
  }

  return prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity: { decrement: 1 } },
  });
};

const cartModel = {
  createCart,
  addProductToCart,
  findCartByUserId,
  decreaseQuantity,
  increaseQuantity,
  getProductsToCart,
  removeProductToCart,
};

export default cartModel;
