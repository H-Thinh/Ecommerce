import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../config/cloudinary.config";

interface StorageOptions {
  folder: string;
}

export const createCloudinaryStorage = ({ folder }: StorageOptions) =>
  new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);

      return {
        folder,
        allowed_formats: ["jpg", "png", "jpeg", "webp", "gif", "bmp"],
        public_id: `${folder}_${timestamp}_${randomId}`,
      };
    },
  });
