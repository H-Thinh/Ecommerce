import { Season } from "../generated/prisma";

export default interface CreateProductType {
  name_product: string;
  description: string;
  price: number;
  image_url: string;
  categoryId: number;
  saleId?: number;
  slug: string;
  season: Season;
}

export interface ProductVariantType {
  productId: number;
  colorId?: number;
  sizeId?: number;
  stock: number;
  image_url?: string;
}
