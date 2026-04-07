export interface CreateReviewType {
  userId: number;
  rating: number;
  comment: string;
  orderItemId: number;
  images: string;
  productId: number;
}

export interface UpdateReviewType {
  rating?: number;
  comment?: string;
  is_approved?: boolean;
  approved_by?: number;
}

export default interface ReviewType {
  id: number;
  userId: number;
  rating: number;
  comment?: string;
  is_approved: boolean;
  approved_at?: Date;
  approved_by?: number;
  orderId?: number;
  createdAt: Date;
  updatedAt: Date;
}
