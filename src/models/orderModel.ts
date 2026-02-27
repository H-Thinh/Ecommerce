import prisma from "../PrismaClient";
import OrderType, { CreateOrderType } from "../types/OrderType";

const createOrder = async (data: CreateOrderType) => {
  // Tách item ra khỏi orderData
  const { item, ...orderData } = data;

  // Tạo order với items trong 1 lần - nested create
  return await prisma.order.create({
    data: {
      ...orderData,
      items: {
        create: item.map((orderItem) => ({
          variantId: orderItem.variantId,
          price: orderItem.price,
          quantity: orderItem.quantity,
        })),
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      voucher: true,
      status: true,
      paymentMethod: true,
      items: {
        include: {
          variant: {
            include: {
              product: true,
              color: true,
              size: true,
            },
          },
        },
      },
    },
  });
};

const getAllOrders = async () =>
  await prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      voucher: true,
      status: true,
      paymentMethod: true,
      items: {
        include: {
          variant: {
            include: {
              product: true,
              color: true,
              size: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

const getOrderById = async (id: number) =>
  await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
        },
      },
      voucher: true,
      status: true,
      paymentMethod: true,
      items: {
        include: {
          variant: {
            include: {
              product: true,
              color: true,
              size: true,
            },
          },
        },
      },
      payment: true,
    },
  });

const getOrdersByUserId = async (userId: number) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      status: true,
      payment: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          id: true,
          status: true,
          method: { select: { id: true, code: true } },
        },
      },
      voucher: { select: { discount_value: true, discount_type: true } },
      items: {
        include: {
          reviews: {
            select: { id: true, comment: true, rating: true, images: true },
          },
          variant: {
            select: {
              product: { select: { name_product: true } },
              image_url: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders.map((order) => {
    const items = order.items.map((i) => {
      const reviewData = i.reviews[0];

      let review = null;

      if (reviewData) {
        let images: string[] = [];

        try {
          images = reviewData.images ? JSON.parse(reviewData.images) : [];
        } catch {
          images = [];
        }

        review = {
          id: reviewData.id,
          content: reviewData.comment,
          rating: reviewData.rating,
          images,
        };
      }

      return {
        id: i.id,
        imageVariant: i.variant.image_url,
        quantity: i.quantity,
        name: i.variant.product.name_product,
        price: i.price,
        review,
      };
    });

    return {
      id: order.id,
      totalPrice: order.total_price,
      items,
      status: order.status,
      createdAt: order.createdAt,
      payment: order.payment[0],
      email: order.receiver_email,
      name: order.receiver_name,
      phone: order.receiver_phone,
      address: order.receiver_address,
      voucher: order.voucher,
      pointDiscount: order.point_discount_amount,
    };
  });
};

const updateOrderById = async (id: number, data: Partial<OrderType>) => {
  const { item, ...updateData } = data;

  return await prisma.order.update({
    where: { id },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      voucher: true,
      status: true,
      paymentMethod: true,
      items: {
        include: {
          variant: {
            include: {
              product: true,
              color: true,
              size: true,
            },
          },
        },
      },
    },
  });
};

const deleteOrderById = async (id: number) =>
  await prisma.order.delete({
    where: { id },
  });

const orderModel = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrderById,
  deleteOrderById,
};

export default orderModel;
