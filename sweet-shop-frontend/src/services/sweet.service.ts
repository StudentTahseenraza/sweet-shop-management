import api from './api';
import { ISweet, ISearchParams } from '../types';

export const sweetService = {
  getAllSweets: async (): Promise<ISweet[]> => {
    const response = await api.get('/sweets');
    return response.data.data;
  },

  getSweetById: async (id: string): Promise<ISweet> => {
    const response = await api.get(`/sweets/${id}`);
    return response.data.data;
  },

  searchSweets: async (params: ISearchParams): Promise<ISweet[]> => {
    const response = await api.get('/sweets/search', { params });
    return response.data.data;
  },

  createSweet: async (sweet: Omit<ISweet, 'id' | 'createdAt' | 'updatedAt'>): Promise<ISweet> => {
    const response = await api.post('/sweets', sweet);
    return response.data.data;
  },

  updateSweet: async (id: string, sweet: Partial<ISweet>): Promise<ISweet> => {
    const response = await api.put(`/sweets/${id}`, sweet);
    return response.data.data;
  },

  deleteSweet: async (id: string): Promise<void> => {
    await api.delete(`/sweets/${id}`);
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/sweets/categories');
    return response.data.data;
  },

  purchaseSweet: async (sweetId: string, quantity: number): Promise<ISweet> => {
    const response = await api.post(`/sweets/${sweetId}/purchase`, { quantity });
    return response.data.data;
  },

  restockSweet: async (sweetId: string, quantity: number): Promise<ISweet> => {
    const response = await api.post(`/sweets/${sweetId}/restock`, { quantity });
    return response.data.data;
  },
};