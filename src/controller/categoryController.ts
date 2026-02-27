import { Request, Response } from "express";
import categoryModel from "../models/categoryModel";
import CategoryType from "../types/CategoryType";
import slugify from "slugify";

const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, genderId, description } = req.body || {};
    const slug = slugify(name, { lower: true, strict: true });

    const file = req.file;

    const image_category = file ? file.path : "";

    const nameExist = await categoryModel.checkName(name);

    if (nameExist) {
      return res.status(400).json({ message: "Trùng name" });
    }

    const categoryData = {
      name_category: name,
      genderId: Number(genderId) || null,
      description: description || "",
      image_category,
      slug,
    };

    const category = await categoryModel.createCategory(categoryData);

    res.status(201).json({
      message: "Tạo dữ liệu thành công",
      data: category,
      type: "success",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error?.message || "Lỗi server",
      error: {
        name: error?.name,
        code: error?.code,
        message: error?.message,
        stack: error?.stack,
      },
      type: "error",
    });
  }
};

const getCategorys = async (req: Request, res: Response) => {
  try {
    const category = await categoryModel.getCategorys();

    res.status(200).json({
      message: "Lấy dữ liệu category thành công",
      data: category,
      type: "success",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error?.message || "Lỗi server",
      error: {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
      },
      type: "error",
    });
  }
};

const updateCategoryById = async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.categoryId);

    const categoryExist = await categoryModel.getCategoryById(categoryId);

    if (!categoryExist) {
      return res
        .status(404)
        .json({ message: "Category không tồn tại", type: "error" });
    }

    const { name, genderId, description } = req.body || {};

    const file = req.file;

    const image_category = file ? file.path : "";

    if (name) {
      const nameExist = await categoryModel.checkNameExcludeId(
        name,
        categoryId,
      );

      if (nameExist) {
        return res.status(400).json({ message: "Trùng name", type: "error" });
      }
    }

    const dataUpdate: Partial<CategoryType> = {};

    if (name !== undefined && name) dataUpdate.name_category = name;
    if (genderId !== undefined && genderId !== 0)
      dataUpdate.genderId = Number(genderId);
    if (description !== undefined && description)
      dataUpdate.description = description;
    if (image_category !== "") dataUpdate.image_category = image_category;

    if (Object.keys(dataUpdate).length === 0) {
      return res
        .status(400)
        .json({ message: "Không có dữ liệu để cập nhật", type: "error" });
    }

    const category = await categoryModel.updateCategoryById(
      categoryId,
      dataUpdate,
    );

    res.status(200).json({
      message: "Cập nhật category thành công",
      data: category,
      type: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const deleteCategoryById = async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.categoryId);

    const categoryExist = await categoryModel.getCategoryById(categoryId);

    if (!categoryExist) {
      return res
        .status(404)
        .json({ message: "Category không tồn tại", type: "error" });
    }

    await categoryModel.getCategoryById(categoryId);

    const remainingCategorys = await categoryModel.getCategorys();

    res.status(200).json({
      message: "Xóa thành công",
      data: remainingCategorys,
      type: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const getCategoryById = async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.categoryId);

    const category = await categoryModel.getCategoryById(categoryId);

    if (!category) {
      return res
        .status(404)
        .json({ message: "Category không tồn tại", type: "error" });
    }

    res.status(200).json({
      message: "Lấy dữ liệu của category thành công",
      data: category,
      type: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const getProductBySlugCategory = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;

    const products = await categoryModel.getProductBySlugCategory(slug);

    if (!products) {
      return res
        .status(404)
        .json({ message: "Không có tồn tại thể loại này", type: "error" });
    }

    res.status(200).json({
      message: "Lấy dữ liệu của category thành công",
      data: products,
      type: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const categoryController = {
  getCategorys,
  createCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  getProductBySlugCategory,
};

export default categoryController;
