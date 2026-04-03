import prisma from "../PrismaClient";
import OrderType, { CreateOrderType } from "../types/OrderType";

const createOrder = async (data: CreateOrderType) => {
  const SHIPPING_DAYS = 3;
  const { item, ...orderData } = data;

  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + SHIPPING_DAYS);

  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Check và trừ stock trước
    for (const orderItem of item) {
      const variant = await tx.productVariant.findUnique({
        where: { id: orderItem.variantId },
        select: { stock: true },
      });

      if (!variant) {
        throw new Error("Variant not found");
      }

      if (variant.stock < orderItem.quantity) {
        throw new Error("Not enough stock");
      }

      // Trừ stock
      await tx.productVariant.update({
        where: { id: orderItem.variantId },
        data: {
          stock: { decrement: orderItem.quantity },
          sold: { increment: orderItem.quantity },
        },
      });
    }

    // 2️⃣ Tạo order + items
    const order = await tx.order.create({
      data: {
        ...orderData,
        estimated_delivery_at: estimatedDate,
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
          select: { id: true, name: true, email: true },
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

    return order;
  });
};

const getAllOrders = async () => {
  const orders = await prisma.order.findMany({
    include: {
      status: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return orders.map((order) => {
    const { status, ...rest } = order;
    return {
      id: order.id,
      name: order.receiver_name,
      email: order.receiver_email,
      totalPrice: order.total_price,
      createdAt: order.createdAt,
      status,
    };
  });
};

const getOrderById = async (id: number) => {
  const order = await prisma.order.findUnique({
    where: { id },
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
              product: { select: { name_product: true, id: true } },
              image_url: true,
              color: { select: { name_color: true } },
              size: { select: { Symbol: true } },
            },
          },
          returns: {
            select: {
              id: true,
              reason: true,
              imageUrl: true,
              status: true,
              adminNote: true,
              refunds: {
                take: 1,
                select: { id: true },
                orderBy: { createdAt: "asc" },
              },
            },
          },
        },
      },
    },
  });

  if (!order) return null;

  const items = order.items.map((i) => {
    const reviewData = i.reviews;

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

    const returnData = i.returns;

    let returns = null;

    if (returnData) {
      let imageReturn: string[] = [];

      try {
        imageReturn = returnData.imageUrl
          ? JSON.parse(returnData.imageUrl)
          : [];
      } catch {
        imageReturn = [];
      }

      returns = {
        id: returnData.id,
        reason: returnData.reason,
        status: returnData.status,
        imageReturn,
        adminNote: returnData.adminNote,
        refundId: returnData.refunds?.[0]?.id ?? null,
      };
    }

    return {
      id: i.id,
      imageVariant: i.variant.image_url,
      quantity: i.quantity,
      name: i.variant.product.name_product,
      price: i.price,
      review,
      size: i.variant.size?.Symbol,
      color: i.variant.color?.name_color,
      productId: i.variant.product.id,
      returns,
    };
  });

  const { is_final, is_cancelable, ...rest } = order.status;

  const status = { ...rest, isFinal: is_final, isCancelable: is_cancelable };

  return {
    id: order.id,
    totalPrice: order.total_price,
    items,
    status,
    createdAt: order.createdAt,
    payment: order.payment[0],
    email: order.receiver_email,
    name: order.receiver_name,
    phone: order.receiver_phone,
    address: order.receiver_address,
    voucher: order.voucher,
    pointDiscount: order.point_discount_amount,
  };
};

const getOrdersByUserId = async (userId: number) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      status: {
        select: {
          code: true,
          id: true,
          hex: true,
          name: true,
          is_cancelable: true,
          is_final: true,
        },
      },
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
      const reviewData = i.reviews;

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

const cancelOrderByAdmin = async (id: number, reason: string) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id },
      include: {
        status: { select: { code: true } },
        items: true, // lấy order items để hoàn stock
      },
    });

    if (!order) {
      throw new Error("Order not found or not yours");
    }

    if (!["PENDING", "PROCESSING"].includes(order.status.code)) {
      throw new Error("Order is not eligible for cancel");
    }

    const cancelledStatus = await tx.orderStatus.findUnique({
      where: { code: "CANCELLED" },
    });

    if (!cancelledStatus) {
      throw new Error("Cancelled status not found");
    }

    // 🔥 Hoàn lại stock
    for (const item of order.items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: {
          stock: { increment: item.quantity },
          sold: { decrement: item.quantity },
        },
      });
    }

    // Update order status
    return await tx.order.update({
      where: { id: order.id },
      data: {
        statusId: cancelledStatus.id,
        cancel_reason: reason,
        cancelledAt: new Date(),
      },
    });
  });
};

const cancelOrderByUserId = async (
  id: number,
  userId: number,
  reason: string,
) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id },
      include: {
        status: { select: { code: true } },
        items: true, // lấy order items để hoàn stock
      },
    });

    if (!order || order.userId !== userId) {
      throw new Error("Order not found or not yours");
    }

    console.log(order.status.code);

    if (!["PENDING", "CONFIRMED", "PROCESSING"].includes(order.status.code)) {
      throw new Error("Order is not eligible for cancel");
    }

    const cancelledStatus = await tx.orderStatus.findUnique({
      where: { code: "CANCELLED" },
    });

    if (!cancelledStatus) {
      throw new Error("Cancelled status not found");
    }

    // 🔥 Hoàn lại stock
    for (const item of order.items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: {
          stock: { increment: item.quantity },
          sold: { decrement: item.quantity },
        },
      });
    }

    // Update order status
    return await tx.order.update({
      where: { id: order.id },
      data: {
        statusId: cancelledStatus.id,
        cancel_reason: reason,
        cancelledAt: new Date(),
      },
    });
  });
};

const returnOrderByUserId = async (
  orderItemId: number,
  userId: number,
  reason: string,
  image_url: string,
) => {
  return await prisma.$transaction(async (tx) => {
    const orderItem = await tx.orderItem.findUnique({
      where: { id: orderItemId },
      include: {
        order: {
          include: { status: true },
        },
      },
    });

    if (!orderItem || orderItem.order.userId !== userId) {
      throw new Error("Order item not found or not yours");
    }

    if (orderItem.order.status.code !== "DELIVERED") {
      throw new Error("Order is not eligible for return");
    }

    const existingReturn = await tx.return.findFirst({
      where: {
        orderItemId: orderItemId,
        status: {
          in: ["PENDING", "APPROVED"],
        },
      },
    });

    if (existingReturn) {
      throw new Error("Return request already exists");
    }

    const newReturn = await tx.return.create({
      data: {
        reason,
        userId,
        orderItemId: orderItemId,
        imageUrl: image_url ?? null,
        status: "PENDING",
      },
    });

    const orderStatus = await tx.orderStatus.findUnique({
      where: { code: "RETURN_REQUESTED" },
    });

    if (!orderStatus) {
      throw new Error("RETURN_REQUESTED status not found");
    }

    await tx.order.update({
      where: { id: orderItem.order.id },
      data: { statusId: orderStatus.id },
    });

    return newReturn;
  });
};

const updateOrderStatusById = async (id: number) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id },
      include: { status: true },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status.is_final) {
      throw new Error("Cannot update final status");
    }

    const nextStatus = await tx.orderStatus.findFirst({
      where: {
        sort_order: {
          gt: order.status.sort_order ?? 0,
        },
      },
      orderBy: {
        sort_order: "asc",
      },
    });

    if (!nextStatus) {
      throw new Error("No next status found");
    }

    const updateData: any = {
      statusId: nextStatus.id,
    };

    if (nextStatus.code === "SHIPPING") {
      updateData.shipped_at = new Date();
    }

    if (nextStatus.code === "DELIVERED") {
      updateData.delivered_at = new Date();
    }

    return await tx.order.update({
      where: { id },
      data: updateData,
    });
  });
};

const getTotalOrders = async (startDate: Date, endDate: Date) => {
  const result = await prisma.order.aggregate({
    _count: true,
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return result._count;
};

const orderModel = {
  createOrder,
  getAllOrders,
  getOrderById,
  getTotalOrders,
  updateOrderById,
  deleteOrderById,
  getOrdersByUserId,
  cancelOrderByAdmin,
  cancelOrderByUserId,
  returnOrderByUserId,
  updateOrderStatusById,
};

export default orderModel;
