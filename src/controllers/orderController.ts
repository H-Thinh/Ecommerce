import { Request, Response } from "express";

import { orderValidation } from "../validation/orderValidation";

import { AuthenticatedRequest } from "../types/express";

import { CreateOrderType } from "../types/OrderType";

import orderModel from "../models/orderModel";
import productModel from "../models/productModel";
import returnModel from "../models/returnModel";
import orderStatusModel from "../models/orderStatusModel";
import productProducer from "../services/rabbitmq/product/product.producer";

const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Vui lòng đăng nhập" });
    }

    const {
      voucherId,
      totalPrice,
      shippingFee,
      address,
      email,
      name,
      note,
      phone,
      usedPoints,
      earnedPoints,
      paymentMethod,
      item,
      pointDiscount,
    } = req.body || {};

    // Validate item array
    if (!item || !Array.isArray(item) || item.length === 0) {
      return res
        .status(400)
        .json({ message: "Vui lòng thêm sản phẩm vào đơn hàng" });
    }

    // Validate và format items
    const formattedItems = [];
    for (let i = 0; i < item.length; i++) {
      const orderItem = item[i];

      // Parse và validate từng field
      const variantId = parseInt(orderItem.variantId.toString());
      const price = parseFloat(orderItem.price.toString());
      const quantity = parseInt(orderItem.quantity.toString());

      if (!variantId || isNaN(variantId)) {
        return res.status(400).json({
          message: `Sản phẩm ${i + 1}: variantId không hợp lệ`,
        });
      }
      if (!price || isNaN(price) || price <= 0) {
        return res.status(400).json({
          message: `Sản phẩm ${i + 1}: price không hợp lệ`,
        });
      }
      if (!quantity || isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({
          message: `Sản phẩm ${i + 1}: quantity không hợp lệ`,
        });
      }

      // Check variant exists
      const variant = await productModel.getProductVariantsById(variantId);

      if (!variant) {
        return res.status(400).json({
          message: `Sản phẩm ${i + 1}: Không tìm thấy variant ${variantId}`,
        });
      }

      if (variant.stock < quantity) {
        return res.status(400).json({
          message: `Sản phẩm ${i + 1}: Không đủ hàng trong kho`,
        });
      }

      formattedItems.push({
        variantId,
        price,
        quantity,
      });
    }

    const orderStatus = await orderStatusModel.getOrderStatusByCode("PENDING");

    if (!orderStatus) {
      return res
        .status(400)
        .json({ message: "Lỗi không tìm thấy trạng thái đơn hàng" });
    }

    const orderData: CreateOrderType = {
      receiver_address: address,
      receiver_email: email,
      receiver_phone: phone,
      receiver_name: name,
      receiver_note: note,
      userId,
      voucherId: voucherId ? parseInt(voucherId) : undefined,
      statusId: orderStatus.id,
      total_price: parseFloat(totalPrice),
      shipping_fee: shippingFee ? parseFloat(shippingFee) : 0,
      used_points: usedPoints ? parseInt(usedPoints) : 0,
      earned_points: earnedPoints ? parseInt(earnedPoints) : 0,
      payment_method: parseInt(paymentMethod),
      item: formattedItems,
      point_discount_amount: pointDiscount ? parseFloat(pointDiscount) : 0,
    };

    const errors = orderValidation(orderData);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    const order = await orderModel.createOrder(orderData);

    for (const item of order.items) {
      await productProducer.publishProductStatusChanged(item.variant.productId);
    }

    return res.status(201).json({
      message: "Tạo đơn hàng thành công",
      totalPrice: order.total_price,
      orderId: order.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderModel.getAllOrders();
    return res
      .status(200)
      .json({ message: "Lấy danh sách đơn hàng thành công", data: orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getOrderById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.orderId);

    if (!id) {
      return res.status(400).json({ message: "ID đơn hàng không hợp lệ" });
    }

    const order = await orderModel.getOrderById(id);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    return res
      .status(200)
      .json({ message: "Lấy thông tin đơn hàng thành công", data: order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Vui lòng đăng nhập" });
    }

    const orders = await orderModel.getOrdersByUserId(userId);
    return res
      .status(200)
      .json({ message: "Lấy danh sách đơn hàng thành công", data: orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const updateOrderById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID đơn hàng không hợp lệ" });
    }

    const existingOrder = await orderModel.getOrderById(id);
    if (!existingOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    const {
      voucherId,
      provinceId,
      statusId,
      total_price,
      shipping_fee,
      used_points,
      earned_points,
      payment_method,
      shipping_address,
    } = req.body || {};

    const updateData: any = {};

    if (voucherId !== undefined) updateData.voucherId = parseInt(voucherId);
    if (provinceId !== undefined) updateData.provinceId = parseInt(provinceId);
    if (statusId !== undefined) updateData.statusId = parseInt(statusId);
    if (total_price !== undefined)
      updateData.total_price = parseFloat(total_price);
    if (shipping_fee !== undefined)
      updateData.shipping_fee = parseFloat(shipping_fee);
    if (used_points !== undefined)
      updateData.used_points = parseInt(used_points);
    if (earned_points !== undefined)
      updateData.earned_points = parseInt(earned_points);
    if (payment_method !== undefined)
      updateData.payment_method = parseInt(payment_method);
    if (shipping_address !== undefined)
      updateData.shipping_address = shipping_address;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
    }

    const order = await orderModel.updateOrderById(id, updateData);

    return res
      .status(200)
      .json({ message: "Cập nhật đơn hàng thành công", data: order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const deleteOrderById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID đơn hàng không hợp lệ" });
    }

    const existingOrder = await orderModel.getOrderById(id);
    if (!existingOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    await orderModel.deleteOrderById(id);
    return res.status(200).json({ message: "Xóa đơn hàng thành công" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const cancelOrderByAdmin = async (req: Request, res: Response) => {
  try {
    const account = (req as AuthenticatedRequest).account;

    if (!account) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập",
        type: "error",
      });
    }

    const { orderId, reason } = req.body;

    if (!orderId || isNaN(Number(orderId))) {
      return res.status(400).json({
        message: "orderId không hợp lệ",
        type: "error",
      });
    }

    const cancelOrder = await orderModel.cancelOrderByAdmin(
      Number(orderId),
      reason,
    );

    if (cancelOrder) {
      return res
        .status(200)
        .json({ message: "Đã hủy đơn hàng thành công", type: "success" });
    }

    return res.status(404).json({ message: "Lỗi không hủy đơn hàng được" });
  } catch (error: any) {
    console.error(error);

    if (error.message === "Order not found") {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
        type: "error",
      });
    }

    if (error.message === "Order is not eligible for cancel") {
      return res.status(400).json({
        message: "Đơn hàng không thể hủy",
        type: "error",
      });
    }

    return res.status(500).json({
      message: "Lỗi server",
      type: "error",
    });
  }
};

const cancelOrderByUserId = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập",
        type: "error",
      });
    }

    const { orderId } = req.params;
    const { reason } = req.body;

    if (!orderId || isNaN(Number(orderId))) {
      return res.status(400).json({
        message: "orderId không hợp lệ",
        type: "error",
      });
    }

    const cancelOrder = await orderModel.cancelOrderByUserId(
      Number(orderId),
      userId,
      reason,
    );

    if (cancelOrder) {
      return res
        .status(200)
        .json({ message: "Đã hủy đơn hàng thành công", type: "success" });
    }

    return res.status(404).json({ message: "Lỗi không hủy đơn hàng được" });
  } catch (error: any) {
    console.error(error);

    if (error.message === "Order not found") {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
        type: "error",
      });
    }

    if (error.message === "Order is not eligible for cancel") {
      return res.status(400).json({
        message: "Đơn hàng không thể hủy",
        type: "error",
      });
    }

    return res.status(500).json({
      message: "Lỗi server",
      type: "error",
    });
  }
};

const returnOrderByUserId = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập",
        type: "error",
      });
    }

    const { orderItemId } = req.params;
    const { reason } = req.body || {};

    const files = req.files as Express.Multer.File[];

    const image_urls = files.map((file) => file.path);

    if (!orderItemId || isNaN(Number(orderItemId))) {
      return res.status(400).json({
        message: "orderId không hợp lệ",
        type: "error",
      });
    }

    const updatedOrder = await orderModel.returnOrderByUserId(
      Number(orderItemId),
      userId,
      reason,
      JSON.stringify(image_urls),
    );

    return res.status(201).json({
      message: "Đã gửi yêu cầu trả đơn hàng thành công",
      type: "success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Lỗi server",
      type: "error",
    });
  }
};

const updateOrderStatusById = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    if (!orderId || isNaN(Number(orderId))) {
      return res.status(400).json({ message: "Invalid orderId" });
    }

    const updatedOrder = await orderModel.updateOrderStatusById(
      Number(orderId),
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const orderController = {
  getMyOrders,
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  cancelOrderByAdmin,
  cancelOrderByUserId,
  returnOrderByUserId,
  updateOrderStatusById,
};

export default orderController;
