import multer from "multer";
import { createCloudinaryStorage } from "../utils/cloudinary.storage";

// export const uploadCover = multer({
//   storage: createCloudinaryStorage({ folder: "coverImage" }),
// });

export const uploadAvatar = multer({
  storage: createCloudinaryStorage({ folder: "avatar" }),
});
