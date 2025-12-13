export interface ISweet {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISweetCreate {
  name: string;
  description?: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface ISweetUpdate {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  quantity?: number;
  imageUrl?: string;
  isActive?: boolean;
}

export interface ISearchParams {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface IPurchaseRequest {
  quantity: number;
}

export interface IRestockRequest {
  quantity: number;
}

export interface IInventoryOperation {
  sweetId: string;
  userId: string;
  quantity: number;
}