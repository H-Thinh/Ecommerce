import prisma from "../PrismaClient";
import GenderType from "../types/GenderType";

const createGender = async (data: GenderType) =>
  await prisma.gender.create({ data });

const getGenders = async () => await prisma.gender.findMany();

const updateGenderById = async (id: number, data: Partial<GenderType>) =>
  await prisma.gender.update({ where: { id }, data });

const deleteGenderById = async (id: number) =>
  await prisma.gender.delete({ where: { id } });

const findGenderById = async (id: number) => {
  const existingGender = await prisma.gender.findUnique({
    where: { id },
  });

  return !!existingGender;
};

const checkName = async (name: string) => {
  const existingName = await prisma.permission.findFirst({ where: { name } });

  return !!existingName;
};

const checkNameExcludeId = async (name: string, id: number) => {
  const existingName = await prisma.permission.findFirst({
    where: { name, NOT: { id } },
  });

  return !!existingName;
};

const getCategoriesBySlugGender = async (slug: string) => {
  const genderWithCategories = await prisma.gender.findUnique({
    where: { slug },
    include: {
      categories: {
        select: {
          id: true,
          name_category: true,
          image_category: true,
          slug: true,
        },
      },
    },
  });

  if (!genderWithCategories) return [];

  return genderWithCategories.categories.map((cat) => ({
    id: cat.id,
    slug: cat.slug,
    name: cat.name_category,
    imageCategory: cat.image_category,
  }));
};

const genderModel = {
  checkName,
  getGenders,
  createGender,
  findGenderById,
  updateGenderById,
  deleteGenderById,
  checkNameExcludeId,
  getCategoriesBySlugGender,
};

export default genderModel;
