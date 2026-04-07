import { Request, Response } from "express";

import paymentModel from "../models/paymentModel";

import {
  paymentValidation,
  updatePaymentValidation,
} from "../validation/paymentValidation";
import { CreatePaymentType, UpdatePaymentType } from "../types/PaymentType";

import crypto from "crypto";
import querystring from "qs";
import paymentMethodModel from "../models/paymentMethodModel";
import { parseDateRange } from "../utils/parseDateRange";

const tmnCode = process.env.VNPAY_TMN_CODE!;
const secretKey = process.env.VNPAY_HASH_SECRET!.trim();
const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

function formatDate(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

const createVNPayUrl = async (req: Request, res: Response) => {
  try {
    const ipAddr =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";

    const { orderId, amount } = req.body;

    const paymentExist = await paymentModel.getPaymentByOrderId(
      Number(orderId),
    );

    if (paymentExist) {
      const payment = await paymentModel.updatePaymentById(paymentExist.id, {
        status: "failed",
      });

      if (payment.status !== "failed") {
        return res.status(404).json({ message: "Lỗi thanh toán" });
      }
    }

    const method = await paymentMethodModel.getPaymentMethodByCode("VNPAY");

    const payment = await paymentModel.createPayment({
      amount,
      orderId: Number(orderId),
      payment_method: method.id,
      payment_date: new Date(),
      status: "processing",
    });

    const createDate = formatDate(new Date());

    let vnp_Params: any = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: payment.id.toString(),
      vnp_OrderInfo: orderId,
      vnp_OrderType: "other",
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: "http://localhost:3002/api/payments/payment-resultVNPAY",
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    vnp_Params = Object.keys(vnp_Params)
      .sort()
      .reduce((acc: any, key) => {
        acc[key] = vnp_Params[key];
        return acc;
      }, {});

    const signData = querystring.stringify(vnp_Params, { encode: true });

    const secureHash = crypto
      .createHmac("sha512", secretKey)
      .update(signData)
      .digest("hex");

    vnp_Params["vnp_SecureHash"] = secureHash;

    res.status(200).json({
      url: vnpUrl + "?" + querystring.stringify(vnp_Params, { encode: false }),
    });
  } catch (error) {
    console.log(error);
  }
};

const resultVnPay = async (req: Request, res: Response) => {
  const vnp_Params: any = { ...req.query };

  const secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((acc: any, key) => {
      acc[key] = vnp_Params[key];
      return acc;
    }, {});

  const signData = querystring.stringify(sortedParams, { encode: true });

  const checkHash = crypto
    .createHmac("sha512", process.env.VNPAY_HASH_SECRET!.trim())
    .update(signData)
    .digest("hex");

  if (secureHash !== checkHash) {
    return res.status(400).json({
      success: false,
      message: "Sai chữ ký",
    });
  }

  const responseCode = vnp_Params["vnp_ResponseCode"];

  const paymentId = vnp_Params["vnp_TxnRef"];
  const orderId = vnp_Params["vnp_OrderInfo"];
  const codebank = vnp_Params["vnp_BankTranNo"];
  const amount = Number(vnp_Params["vnp_Amount"]) / 100;
  const raw = vnp_Params["vnp_PayDate"];

  const year = raw.substring(0, 4);
  const month = raw.substring(4, 6);
  const day = raw.substring(6, 8);
  const hour = raw.substring(8, 10);
  const minute = raw.substring(10, 12);
  const second = raw.substring(12, 14);

  const paymentDate = new Date(
    `${year}-${month}-${day}T${hour}:${minute}:${second}`,
  );

  if (responseCode === "00") {
    const payment = await paymentModel.updatePaymentById(Number(paymentId), {
      payment_date: paymentDate,
      status: "success",
      transaction_reference: vnp_Params["vnp_BankTranNo"],
    });

    if (payment) {
      return res.redirect(
        `http://localhost:3000/payment/notification?order=${orderId}&amount=${amount}&code=${codebank}&method=${"VNPAY"}`,
      );
    }
  } else {
    console.log("Loi");

    return res.json({
      success: false,
      message: "Thanh toán thất bại",
    });
  }
};

const createPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, amount } = req.body;

    const method = await paymentMethodModel.getPaymentMethodByCode("COD");

    const errorsPayment = paymentValidation({
      orderId,
      amount,
      payment_method: method.id,
    });

    if (!errorsPayment) {
      return res.status(404).json({ message: errorsPayment });
    }

    const payment = paymentModel.createPayment({
      amount,
      orderId,
      status: "pending",
      payment_method: method.id,
    });

    res.status(200).json({ message: "Thanh toán thành công", data: payment });
  } catch (error) {
    console.log(error);
  }
};

const getPaymentById = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;

    const payment = await paymentModel.getPaymentById(Number(paymentId));

    res
      .status(200)
      .json({ message: "Lấy thông thanh toán thành công", data: payment });
  } catch (error) {
    console.log(error);
  }
};

const confirmCodPaymentReceived = async (req: Request, res: Response) => {
  try {
    const { id, adminId } = req.params;

    if (!id || !adminId) {
      return res.status(400).json({
        message: "Payment id and adminId are required",
      });
    }

    const payment = await paymentModel.confirmCodPaymentReceived(
      Number(id),
      Number(adminId),
    );

    return res.status(200).json({
      message: "Đã nhận tiền đơn ship COD thành công",
      data: payment,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

const getRevenue = async (req: Request, res: Response) => {
  try {
    const { start, end } = parseDateRange(req.query);

    const revenue = await paymentModel.getRevenueByDate(start, end);

    res.json({
      message: "Lấy doanh thu thành công",
      data: revenue,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

const paymentController = {
  getRevenue,
  resultVnPay,
  createPayment,
  getPaymentById,
  createVNPayUrl,
  confirmCodPaymentReceived,
};

export default paymentController;
