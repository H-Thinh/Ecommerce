import { Request, Response } from "express";
import productModel from "../models/productModel";
import ProductType, { ProductVariantType } from "../types/ProductType";
import productProducer from "../services/rabbitmq/product/product.producer";

import slugify from "slugify";

const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, categoryId, saleId, season } =
      req.body || {};

    const slug = slugify(name, { lower: true, strict: true });

    const files = req.files as Express.Multer.File[];

    const image_urls = files.map((file) => file.path);

    const product = await productModel.createProduct({
      season: season,
      name_product: name,
      description,
      image_url: JSON.stringify(image_urls),
      price,
      categoryId: Number(categoryId),
      saleId: Number(saleId),
      slug,
    });

    res.status(201).json({ message: "Tạo dữ liệu thành công", data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productModel.getAllProducts();

    res.status(200).json({ message: "Lấy dữ liệu thành công", data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const featuredProducts = await productModel.getFeaturedProducts();

    res.status(200).json({
      message: "Lấy các sản phẩm nỗi bật thành công",
      data: featuredProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;

    const product = await productModel.getProductBySlug(slug);

    if (!product) {
      return res.status(404).json({ message: "Product này không tồn tại" });
    }

    res.status(200).json({
      message: "Lấy chi tiết sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getSaleProducts = async (req: Request, res: Response) => {
  try {
    const products = await productModel.getSaleProducts();

    if (!products) {
      return res.status(404).json({ message: "không có sản phẩm" });
    }

    res.status(200).json({
      message: "Lấy các sản phẩm đang sale thành công",
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.productId);

    const product = await productModel.getProductById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product này không tồn tại" });
    }

    res.status(200).json({ message: "Lấy dữ liệu thành công", data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const updateProductById = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.productId);

    const productExist = await productModel.getProductById(productId);

    if (!productExist) {
      return res.status(404).json({ message: "Product này không tồn tại" });
    }

    const { name, description, price, categoryId, saleId } = req.body || {};

    const files = req.files as Express.Multer.File[];

    const image_urls = files.map((file) => file.path);

    const dataUpdate: Partial<ProductType> = {};

    if (name !== undefined) dataUpdate.name_product = name;
    if (description !== undefined) dataUpdate.description = description;
    if (price !== undefined) dataUpdate.price = price;
    if (categoryId !== undefined) dataUpdate.categoryId = Number(categoryId);
    if (saleId !== undefined) dataUpdate.saleId = Number(saleId);
    if (image_urls !== undefined)
      dataUpdate.image_url = JSON.stringify(image_urls);

    if (Object.keys(dataUpdate).length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
    }

    const product = await productModel.updateProductById(productId, dataUpdate);

    res
      .status(200)
      .json({ message: "Cập nhật permission thành công", data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const deleteProductById = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.productId);

    const productExist = await productModel.getProductById(productId);

    if (!productExist) {
      return res.status(404).json({ message: "Product này không tồn tại" });
    }

    await productModel.deleteProductById(productId);

    const remainingProducts = await productModel.getAllProducts();

    res
      .status(200)
      .json({ message: "Xóa thành công", data: remainingProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const createProductVariant = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.productId);

    const productExist = await productModel.getProductById(productId);

    if (!productExist) {
      return res.status(404).json({ message: "Product này không tồn tại" });
    }

    const file = req.file;

    const image = file ? file.path : "";

    const { colorId, sizeId, stock } = req.body || {};

    const variant = await productModel.createProductVariant({
      productId,
      colorId: Number(colorId),
      sizeId: Number(sizeId),
      stock: Number(stock),
      image_url: image,
    });

    await productProducer.publishProductStatusChanged(variant.productId);

    res.status(201).json({ message: "Tạo dữ liệu thành công", data: variant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getProductVariants = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.productId);

    const productExist = await productModel.getProductById(productId);

    if (!productExist) {
      return res.status(404).json({ message: "Product này không tồn tại" });
    }

    const variants = await productModel.getProductVariants(productId);

    res.status(200).json({ message: "Lấy dữ liệu thành công", data: variants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const updateProductVariantById = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.productId);

    const productExist = await productModel.getProductById(productId);

    if (!productExist) {
      return res.status(404).json({ message: "Product này không tồn tại" });
    }

    const variantId = Number(req.params.variantId);

    const variantExist = await productModel.getProductVariants(variantId);

    if (!variantExist) {
      return res.status(404).json({ message: "Product này không tồn tại" });
    }

    const { colorId, sizeId, stock } = req.body || {};

    const file = req.file;

    const image = file ? file.path : "";

    const dataUpdate: Partial<ProductVariantType> = {};

    if (colorId !== undefined && colorId !== 0) dataUpdate.colorId = colorId;
    if (sizeId !== undefined && sizeId !== 0) dataUpdate.sizeId = sizeId;
    if (stock !== undefined && stock > 0) dataUpdate.stock = stock;
    if (image !== undefined) dataUpdate.image_url = image;

    if (Object.keys(dataUpdate).length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
    }

    const variant = await productModel.updateProductVariantById(
      variantId,
      dataUpdate,
    );

    res
      .status(200)
      .json({ message: "Cập nhật variant thành công", data: variant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const deleteProductVariantById = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.productId);

    const productExist = await productModel.getProductById(productId);

    if (!productExist) {
      return res.status(404).json({ message: "Product này không tồn tại" });
    }

    const variantId = Number(req.params.variantId);

    const variantExist = await productModel.getProductVariantsById(variantId);

    if (!variantExist) {
      return res.status(404).json({ message: "Product này không tồn tại" });
    }

    await productModel.deleteProductVariantById(variantId);

    const remainingVariants = await productModel.getProductVariants(productId);

    res
      .status(200)
      .json({ message: "Xóa thành công", data: remainingVariants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const productController = {
  createProduct,
  getAllProducts,
  getProductById,
  getSaleProducts,
  getProductBySlug,
  updateProductById,
  deleteProductById,
  getProductVariants,
  getFeaturedProducts,
  createProductVariant,
  updateProductVariantById,
  deleteProductVariantById,
};

export default productController;
