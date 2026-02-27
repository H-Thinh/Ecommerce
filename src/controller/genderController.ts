import { Request, Response } from "express";
import genderModel from "../models/genderModel";
import GenderType from "../types/GenderType";
import slugify from "slugify";

const createGender = async (req: Request, res: Response) => {
  try {
    const { name_gender } = req.body || {};
    const slug = slugify(name_gender, { lower: true, strict: true });

    const nameExist = await genderModel.checkName(name_gender);

    if (nameExist) {
      return res.status(400).json({ message: "Trùng name" });
    }

    const gender = await genderModel.createGender({
      name_gender,
      slug,
    });

    res.status(201).json({ message: "Tạo dữ liệu thành công", data: gender });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getGenders = async (req: Request, res: Response) => {
  try {
    const genders = await genderModel.getGenders();

    res.status(200).json({ message: "Lấy dữ liệu thành công", data: genders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const updateGenderById = async (req: Request, res: Response) => {
  try {
    const genderId = Number(req.params.genderId);

    const genderExist = await genderModel.findGenderById(genderId);

    if (!genderExist) {
      return res.status(404).json({ messsage: "Gender không tồn tại" });
    }

    const { name_gender } = req.body || {};

    if (name_gender) {
      const nameExist = await genderModel.checkNameExcludeId(
        name_gender,
        genderId,
      );

      if (nameExist) {
        return res.status(400).json({ message: "Trùng name" });
      }
    }

    const dataUpdate: Partial<GenderType> = {};

    if (name_gender !== undefined) dataUpdate.name_gender = name_gender;

    if (Object.keys(dataUpdate).length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
    }

    const gender = await genderModel.updateGenderById(genderId, dataUpdate);

    res
      .status(200)
      .json({ message: "Cập nhật gender thành công", data: gender });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const deleteGenderById = async (req: Request, res: Response) => {
  try {
    const genderId = Number(req.params.genderId);

    const genderExist = await genderModel.findGenderById(genderId);

    if (!genderExist) {
      return res.status(404).json({ messsage: "Gender không tồn tại" });
    }

    await genderModel.deleteGenderById(genderId);

    const remainingGenders = await genderModel.getGenders();

    res.status(200).json({ message: "Xóa thành công", data: remainingGenders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getCategoriesBySlugGender = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;

    const gender = await genderModel.getCategoriesBySlugGender(slug);

    if (!gender) {
      return res
        .status(404)
        .json({ messsage: "Gender không tồn tại", type: "error" });
    }

    res.status(200).json({
      message: "lấy dữ liệu gender thành công",
      data: gender,
      type: "succes",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const genderController = {
  getGenders,
  createGender,
  updateGenderById,
  deleteGenderById,
  getCategoriesBySlugGender,
};

export default genderController;
