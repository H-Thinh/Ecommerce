import { Request, Response } from "express";

import cartModel from "../models/cartModel";

import { AuthenticatedRequest } from "../types/express";

const createCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Vui lòng đăng nhập" });
    }

    const cartExist = await cartModel.findCartByUserId(userId);

    if (cartExist) {
      return res
        .status(200)
        .json({ message: "Bạn đã có cart", data: cartExist });
    }

    const cart = await cartModel.createCart(userId);
    return res
      .status(201)
      .json({ message: "Tạo giỏ hàng thành công", data: cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const addProductToCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Vui lòng đăng nhập" });
    }

    // Get or create cart
    let cart = await cartModel.findCartByUserId(userId);
    if (!cart) {
      cart = await cartModel.createCart(userId);
    }
    const variantId = Number(req.params.variantId);

    const quantity = Number(req.query.quantity);

    if (!variantId || !quantity) {
      return res.status(400).json({ message: "Thiếu variantId hoặc quantity" });
    }

    const addToCart = await cartModel.addProductToCart({
      cartId: cart.id,
      quantity,
      variantId,
    });

    return res
      .status(201)
      .json({ message: "Thêm vào giỏ hàng thành công", data: addToCart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const removeProductToCart = async (req: Request, res: Response) => {
  try {
    const variantId = Number(req.params.variantId);
    const userId = (req as AuthenticatedRequest).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Vui lòng đăng nhập" });
    }

    if (!variantId) {
      return res.status(400).json({ message: "Thiếu variantId" });
    }

    const cart = await cartModel.findCartByUserId(userId);
    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    }

    const result = await cartModel.removeProductToCart(cart.id, variantId);

    if (!result) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
    }

    return res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ hàng" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getProductsToCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Vui lòng đăng nhập" });
    }

    const cart = await cartModel.findCartByUserId(userId);
    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    }

    const products = await cartModel.getProductsToCart(cart.id, userId);
    return res
      .status(200)
      .json({ message: "Lấy dữ liệu thành công", data: products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const increaseQuantity = async (req: Request, res: Response) => {
  try {
    const variantId = Number(req.params.variantId);
    const userId = (req as AuthenticatedRequest).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Vui lòng đăng nhập" });
    }

    if (!variantId) {
      return res.status(400).json({ message: "Thiếu variantId" });
    }

    const cart = await cartModel.findCartByUserId(userId);
    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    }

    const result = await cartModel.increaseQuantity(cart.id, variantId);
    return res
      .status(200)
      .json({ message: "Tăng số lượng thành công", data: result });
  } catch (error: any) {
    console.error(error);
    return res
      .status(400)
      .json({ message: error.message || "Không thể tăng số lượng" });
  }
};

const decreaseQuantity = async (req: Request, res: Response) => {
  try {
    const variantId = Number(req.params.variantId);
    const userId = (req as AuthenticatedRequest).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Vui lòng đăng nhập" });
    }

    if (!variantId) {
      return res.status(400).json({ message: "Thiếu variantId" });
    }

    const cart = await cartModel.findCartByUserId(userId);
    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    }

    const result = await cartModel.decreaseQuantity(cart.id, variantId);
    return res
      .status(200)
      .json({ message: "Giảm số lượng thành công", data: result });
  } catch (error: any) {
    console.error(error);
    return res
      .status(400)
      .json({ message: error.message || "Không thể giảm số lượng" });
  }
};

const cartController = {
  createCart,
  addProductToCart,
  increaseQuantity,
  decreaseQuantity,
  getProductsToCart,
  removeProductToCart,
};

export default cartController;
