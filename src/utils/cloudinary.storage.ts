import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
import { AuthenticatedRequest } from "../type/express";

interface StorageOptions {
  folder: string;
}

export const createCloudinaryStorage = ({ folder }: StorageOptions) =>
  new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      const username = (req as AuthenticatedRequest).user?.username ?? "guest";

      return {
        folder,
        allowed_formats: ["jpg", "png", "jpeg"],
        public_id: `${username}_${Date.now()}`,
      };
    },
  });
