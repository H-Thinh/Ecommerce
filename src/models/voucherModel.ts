import prisma from "../PrismaClient";
import VoucherType from "../types/VoucherType";

const createVoucher = async (data: VoucherType) =>
  await prisma.voucher.create({ data });

const getVouchers = async (search?: string) => {
  const keyword = search?.trim();

  const vouchers = await prisma.voucher.findMany({
    where: keyword
      ? {
          code: {
            contains: keyword,
          },
        }
      : {},
    include: {
      _count: {
        select: { orders: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return vouchers.map(({ _count, ...rest }) => ({
    ...rest,
    usedCount: _count.orders,
  }));
};

const updateVoucherById = async (id: number, data: Partial<VoucherType>) =>
  await prisma.voucher.update({ where: { id }, data });

const deleteVoucherById = async (id: number) =>
  await prisma.voucher.delete({ where: { id } });

const findVoucherById = async (id: number) => {
  const existingVoucher = await prisma.voucher.findUnique({
    where: { id },
  });

  return !!existingVoucher;
};

const checkCode = async (name: string) => {
  const existingCode = await prisma.voucher.findFirst({
    where: { code: name },
  });

  return !!existingCode;
};

const checkCodeExcludeId = async (name: string, id: number) => {
  const existingCode = await prisma.voucher.findFirst({
    where: { code: name, NOT: { id } },
  });

  return !!existingCode;
};

const getVoucherByCode = async (
  code: string,
  total: number,
  userId: number,
) => {
  const voucher = await prisma.voucher.findUnique({
    where: { code },
    select: {
      id: true,
      discount_type: true,
      discount_value: true,
      min_order_value: true,
      usage_limit: true,
      start_date: true,
      end_date: true,
      is_active: true,
    },
  });

  if (!voucher) {
    throw new Error("Không có voucher");
  }

  // 🔥 1. Check active
  if (!voucher.is_active) {
    throw new Error("Voucher không hoạt động");
  }

  const now = new Date();

  // 🔥 2. Check thời gian
  if (voucher.start_date && now < voucher.start_date) {
    throw new Error("Voucher chưa bắt đầu");
  }

  if (voucher.end_date && now > voucher.end_date) {
    throw new Error("Voucher đã hết hạn");
  }

  // 🔥 3. Check min order value
  if (total < voucher.min_order_value.toNumber()) {
    throw new Error("Chưa đạt giá trị tối thiểu");
  }

  // 🔥 4. Check usage limit
  if (voucher.usage_limit !== null) {
    const usedCount = await prisma.order.count({
      where: { voucherId: voucher.id },
    });

    if (usedCount >= voucher.usage_limit) {
      throw new Error("Voucher đã hết lượt sử dụng");
    }
  }

  // 🔥 5. Check user đã dùng chưa (optional)
  const userUsed = await prisma.order.findFirst({
    where: {
      voucherId: voucher.id,
      userId,
    },
  });

  if (userUsed) {
    throw new Error("Bạn đã sử dụng voucher này rồi");
  }

  return voucher;
};

const voucherModel = {
  checkCode,
  getVouchers,
  createVoucher,
  findVoucherById,
  getVoucherByCode,
  updateVoucherById,
  deleteVoucherById,
  checkCodeExcludeId,
};

export default voucherModel;
