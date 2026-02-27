import crypto from "crypto";
import { Request, Response } from "express";
import querystring from "qs";

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

export const createVNPayUrl = (
  orderId: string,
  amount: number,
  ipAddr: string,
) => {
  const createDate = formatDate(new Date());

  let vnp_Params: any = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanhtoandonhang${orderId}`,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: "http://localhost:3002/api/vnpay/payment-result",
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

  return vnpUrl + "?" + querystring.stringify(vnp_Params, { encode: false });
};


