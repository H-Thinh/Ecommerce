export interface CreateUserType {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface UpdateUserType {
  email?: string;
  name?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  points?: number;
  type?: "increase" | "decrease";
  description?: string;
}

export default interface UserType {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  points: number;
  avatar: string;
  is_active: boolean;
  is_verifyEmail: boolean;
  createdAt: Date;
  updatedAt: Date;
}
