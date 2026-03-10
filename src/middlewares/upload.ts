import multer from "multer";
import { createCloudinaryStorage } from "../services/cloudinary/cloudinary.storage";

export const uploadProductCovers = multer({
  storage: createCloudinaryStorage({ folder: "productCover" }),
});

export const uploadVarianttCover = multer({
  storage: createCloudinaryStorage({ folder: "variantCover" }),
});

export const uploadAvatarAccount = multer({
  storage: createCloudinaryStorage({ folder: "avatar_account" }),
});

export const uploadAvatarUser = multer({
  storage: createCloudinaryStorage({ folder: "avatar_user" }),
});

export const uploadCoverCategory = multer({
  storage: createCloudinaryStorage({ folder: "category" }),
});

export const uploadImageReview = multer({
  storage: createCloudinaryStorage({ folder: "review" }),
});

export const uploadImageReturnOrder = multer({
  storage: createCloudinaryStorage({ folder: "returnOrder" }),
});

export const uploadImageOrderRefund = multer({
  storage: createCloudinaryStorage({ folder: "orderRefund" }),
});
