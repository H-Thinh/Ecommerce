import express from "express";

import auth from "./auth/auth";
import role from "./role/role";
import size from "./size/size";
import user from "./user/user";
import sale from "./sale/sale";
import cart from "./cart/cart";
import order from "./order/order";
import color from "./color/color";
import admin from "./admin/admin";
import gender from "./gender/gender";
import review from "./review/review";
import account from "./account/account";
import voucher from "./voucher/voucher";
import product from "./product/product";
import payment from "./payment/payment";
import category from "./category/category";
import pointRule from "./pointRule/pointRule";
import permission from "./permission/permission";
import orderStatus from "./orderStatus/orderStatus";
import paymentMethod from "./paymentMethod/paymentMethod";
import productStatus from "./productStatus/productStatus";
import permissionGroup from "./permissionGroup/permissionGroup";
import rolePermissionGroup from "./rolePermissionGroup/rolePermissionGroupRoutes";

const router = express.Router();

router.use("/auths", auth);

router.use("/roles", role);

router.use("/sizes", size);

router.use("/carts", cart);

router.use("/sales", sale);

router.use("/users", user);

router.use("/admins", admin);

router.use("/colors", color);

router.use("/orders", order);

router.use("/reviews", review);

router.use("/genders", gender);

router.use("/accounts", account);

router.use("/products", product);

router.use("/vouchers", voucher);

router.use("/payments", payment);

router.use("/categorys", category);

router.use("/point-rules", pointRule);

router.use("/permissions", permission);

router.use("/order-statuses", orderStatus);

router.use("/payment-methods", paymentMethod);

router.use("/product-statuses", productStatus);

router.use("/permission-groups", permissionGroup);

router.use("/role-permission-groups", rolePermissionGroup);

export default router;
