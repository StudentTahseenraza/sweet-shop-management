export interface ISweet {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPurchase {
  id: string;
  sweetId: string;
  userId: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  sweet: ISweet;
}

export interface ICartItem {
  sweet: ISweet;
  quantity: number;
}

export interface ISearchParams {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}