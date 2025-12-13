import api from './api';

// Define interfaces locally
interface ISweet {
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

interface ISearchParams {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export const sweetService = {
  getAllSweets: async (): Promise<ISweet[]> => {
    const response = await api.get('/sweets');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch sweets');
  },

  getSweetById: async (id: string): Promise<ISweet> => {
    const response = await api.get(`/sweets/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch sweet');
  },

  searchSweets: async (params: ISearchParams): Promise<ISweet[]> => {
    const response = await api.get('/sweets/search', { params });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Search failed');
  },

  createSweet: async (sweetData: Omit<ISweet, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>): Promise<ISweet> => {
    const response = await api.post('/sweets', sweetData);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create sweet');
  },

  updateSweet: async (id: string, sweetData: Partial<ISweet>): Promise<ISweet> => {
    const response = await api.put(`/sweets/${id}`, sweetData);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update sweet');
  },

  deleteSweet: async (id: string): Promise<void> => {
    const response = await api.delete(`/sweets/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete sweet');
    }
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/sweets/categories');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch categories');
  },

  purchaseSweet: async (sweetId: string, quantity: number): Promise<ISweet> => {
    const response = await api.post(`/sweets/${sweetId}/purchase`, { quantity });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Purchase failed');
  },

  restockSweet: async (sweetId: string, quantity: number): Promise<ISweet> => {
    const response = await api.post(`/sweets/${sweetId}/restock`, { quantity });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Restock failed');
  },

  getLowStockSweets: async (threshold: number = 10): Promise<ISweet[]> => {
    const response = await api.get('/inventory/low-stock', { params: { threshold } });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch low stock sweets');
  },
};