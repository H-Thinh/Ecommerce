import { Request, Response } from "express";

import paymentModel from "../models/paymentModel";
import { formatDateToString } from "../utils/fomatDate";
import refundModel from "../models/refundModel";

// const updateRefundByVNPAY = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { reason, amount, adminId, paymentId } = req.body || {};

//     if (!amount || !adminId || !paymentId) {
//       return res.status(400).json({
//         message: "Thiếu dữ liệu cần thiết",
//       });
//     }

//     const payment = await paymentModel.getPaymentById(Number(paymentId));

//     if (!payment) {
//       return res.status(404).json({ message: "Payment not found" });
//     }

//     if (!payment.transaction_reference) {
//       return res.status(400).json({ message: "Thiếu mã giao dịch VNPay" });
//     }

//     if (!payment.payment_date) {
//       return res.status(400).json({ message: "Thiếu thời gian thanh toán" });
//     }

//     const refundVNPAY = await refundVNPay(
//       {
//         id: payment.id,
//         payment_date: formatDateToString(payment.payment_date),
//         transaction_reference: payment.transaction_reference,
//       },
//       amount,
//       payment.orderId,
//     );

//     if (refundVNPAY.code !== "00") {
//       return res.status(400).json({
//         message: "Hoàn tiền thất bại",
//         data: refundVNPAY,
//       });
//     }

//     const refund = await refundModel.updateRefundByVNPAY(
//       Number(id),
//       adminId,
//       reason,
//       refundVNPAY.transactionNo,
//     );

//     return res.json({
//       message: "Hoàn tiền thành công",
//       data: refund,
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       message: "Lỗi hệ thống khi hoàn tiền",
//     });
//   }
// };

const processManualRefund = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason, adminId } = req.body || {};

    const image = req.file?.path || "";

    if (!id) {
      return res.status(400).json({
        message: "Refund id is required",
      });
    }

    const refund = await refundModel.processManualRefund(
      Number(id),
      Number(adminId),
      reason,
      image,
    );

    return res.json({
      message: "Hoàn tiền thủ công thành công",
      data: refund,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Manual refund failed",
    });
  }
};

const refundController = { processManualRefund };

export default refundController;
