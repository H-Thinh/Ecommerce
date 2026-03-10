import { PaymentStatus } from "../generated/prisma";
import prisma from "../PrismaClient";

const updateRefundByVNPAY = async (
  id: number,
  adminId: number,
  reason: string,
  vnp_TransactionNo: string,
) => {
  return await prisma.refund.update({
    where: { id },
    data: {
      processedByAdmin: { connect: { id: adminId } },
      reason,
      transaction_reference: vnp_TransactionNo,
      status: "success",
      refundedAt: new Date(),
    },
  });
};

const processManualRefund = async (
  id: number,
  adminId: number,
  reason: string,
  image: string,
) => {
  await prisma.$transaction(async (tx) => {
    const refund = await tx.refund.update({
      where: { id },
      data: {
        processedByAdminId: adminId,
        reason,
        refundProofImage: image,
        status: "success",
        refundedAt: new Date(),
      },
    });

    const payment = await tx.payment.findUnique({
      where: { id: refund.paymentId },
    });

    if (!payment) throw new Error("Payment not found");

    const totalRefunded = await tx.refund.aggregate({
      where: {
        paymentId: refund.paymentId,
        status: "success",
      },
      _sum: {
        amount: true,
      },
    });

    const refundedAmount = Number(totalRefunded._sum.amount || 0);

    let status: PaymentStatus = PaymentStatus.success;

    if (refundedAmount === Number(payment.amount)) {
      status = PaymentStatus.refunded;
    } else if (refundedAmount > 0) {
      status = PaymentStatus.partially_refunded;
    }

    await tx.payment.update({
      where: { id: refund.paymentId },
      data: { status },
    });

    const returnedStatus = await tx.orderStatus.findUnique({
      where: { code: "RETURNED" },
    });

    if (!returnedStatus) {
      throw new Error("Order status RETURNED not found");
    }

    const partiallyReturnedStatus = await tx.orderStatus.findUnique({
      where: { code: "PARTIALLY_RETURNED" },
    });

    if (!partiallyReturnedStatus) {
      throw new Error("Order status PARTIALLY_RETURNED not found");
    }

    if (status === PaymentStatus.refunded) {
      await tx.order.update({
        where: { id: payment.orderId },
        data: { statusId: returnedStatus.id },
      });
    } else if (status === PaymentStatus.partially_refunded) {
      await tx.order.update({
        where: { id: payment.orderId },
        data: { statusId: partiallyReturnedStatus.id },
      });
    }
  });
};

const refundModel = { updateRefundByVNPAY, processManualRefund };

export default refundModel;
