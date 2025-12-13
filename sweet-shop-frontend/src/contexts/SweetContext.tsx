import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { sweetService } from '../services/sweet.service';
import toast from 'react-hot-toast';

// Define interface locally
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

interface SweetContextType {
  sweets: ISweet[];
  loading: boolean;
  categories: string[];
  searchSweets: (params: any) => Promise<void>;
  refreshSweets: () => Promise<void>;
  purchaseSweet: (sweetId: string, quantity: number) => Promise<void>;
  addSweet: (sweetData: any) => Promise<void>;
  updateSweet: (id: string, sweetData: any) => Promise<void>;
  deleteSweet: (id: string) => Promise<void>;
  getSweetById: (id: string) => Promise<ISweet>;
}

const SweetContext = createContext<SweetContextType | undefined>(undefined);

export const useSweets = () => {
  const context = useContext(SweetContext);
  if (!context) {
    throw new Error('useSweets must be used within a SweetProvider');
  }
  return context;
};

interface SweetProviderProps {
  children: ReactNode;
}

export const SweetProvider: React.FC<SweetProviderProps> = ({ children }) => {
  const [sweets, setSweets] = useState<ISweet[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const data = await sweetService.getAllSweets();
      setSweets(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch sweets');
      setSweets([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await sweetService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Set default categories if API fails
      setCategories(['Chocolate', 'Cake', 'Cupcake', 'Tart', 'Macaron', 'Brownie', 'Cookie', 'Donut']);
    }
  };

  useEffect(() => {
    fetchSweets();
    fetchCategories();
  }, []);

  const searchSweets = async (params: any) => {
    try {
      setLoading(true);
      const data = await sweetService.searchSweets(params);
      setSweets(data);
    } catch (error: any) {
      toast.error(error.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const refreshSweets = async () => {
    await fetchSweets();
    await fetchCategories();
  };

  const purchaseSweet = async (sweetId: string, quantity: number) => {
    try {
      await sweetService.purchaseSweet(sweetId, quantity);
      await refreshSweets();
      toast.success('Purchase successful!');
    } catch (error: any) {
      toast.error(error.message || 'Purchase failed');
      throw error;
    }
  };

  const addSweet = async (sweetData: any) => {
    try {
      const newSweet = await sweetService.createSweet(sweetData);
      setSweets(prev => [newSweet, ...prev]);
      toast.success('Sweet added successfully!');
      return newSweet;
    } catch (error: any) {
      toast.error(error.message || 'Failed to add sweet');
      throw error;
    }
  };

  const updateSweet = async (id: string, sweetData: any) => {
    try {
      const updatedSweet = await sweetService.updateSweet(id, sweetData);
      setSweets(prev => prev.map(sweet => 
        sweet.id === id ? updatedSweet : sweet
      ));
      toast.success('Sweet updated successfully!');
      return updatedSweet;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update sweet');
      throw error;
    }
  };

  const deleteSweet = async (id: string) => {
    try {
      await sweetService.deleteSweet(id);
      setSweets(prev => prev.filter(sweet => sweet.id !== id));
      toast.success('Sweet deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete sweet');
      throw error;
    }
  };

  const getSweetById = async (id: string): Promise<ISweet> => {
    try {
      return await sweetService.getSweetById(id);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch sweet');
      throw error;
    }
  };

  const value = {
    sweets,
    loading,
    categories,
    searchSweets,
    refreshSweets,
    purchaseSweet,
    addSweet,
    updateSweet,
    deleteSweet,
    getSweetById,
  };

  return (
    <SweetContext.Provider value={value}>
      {children}
    </SweetContext.Provider>
  );
};