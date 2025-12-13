import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";

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
}

const SweetContext = createContext<SweetContextType | undefined>(undefined);

export const useSweets = () => {
  const context = useContext(SweetContext);
  if (!context) {
    throw new Error("useSweets must be used within a SweetProvider");
  }
  return context;
};

interface SweetProviderProps {
  children: ReactNode;
}

export const SweetProvider: React.FC<SweetProviderProps> = ({ children }) => {
  const [sweets, setSweets] = useState<ISweet[]>([]);
  const [categories, setCategories] = useState<string[]>([
    "Chocolate", "Cake", "Cupcake", "Tart", "Macaron", "Brownie", "Cookie", "Donut"
  ]);
  const [loading, setLoading] = useState(true);

  const mockSweets: ISweet[] = [
    {
      id: "1",
      name: "Chocolate Truffle",
      description: "Rich dark chocolate truffle with cocoa powder",
      category: "Chocolate",
      price: 2.99,
      quantity: 50,
      imageUrl: "https://images.unsplash.com/photo-1623334044303-241021148842",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Strawberry Cheesecake",
      description: "Creamy cheesecake with fresh strawberry topping",
      category: "Cake",
      price: 4.99,
      quantity: 25,
      imageUrl: "https://images.unsplash.com/photo-1624353365286-3f8d62dadadf",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Vanilla Cupcake",
      description: "Soft vanilla cupcake with buttercream frosting",
      category: "Cupcake",
      price: 3.49,
      quantity: 100,
      imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Lemon Tart",
      description: "Tangy lemon filling in a buttery crust",
      category: "Tart",
      price: 3.99,
      quantity: 30,
      imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "5",
      name: "Macarons Assortment",
      description: "Assorted French macarons in various flavors",
      category: "Macaron",
      price: 12.99,
      quantity: 40,
      imageUrl: "https://images.unsplash.com/photo-1569929238190-869826b1bb05",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setSweets(mockSweets);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const searchSweets = async (params: any) => {
    try {
      setLoading(true);
      // Mock search - filter based on params
      let filtered = [...mockSweets];
      
      if (params.name) {
        filtered = filtered.filter(sweet => 
          sweet.name.toLowerCase().includes(params.name.toLowerCase())
        );
      }
      
      if (params.category) {
        filtered = filtered.filter(sweet => 
          sweet.category === params.category
        );
      }
      
      if (params.minPrice) {
        filtered = filtered.filter(sweet => 
          sweet.price >= params.minPrice
        );
      }
      
      if (params.maxPrice) {
        filtered = filtered.filter(sweet => 
          sweet.price <= params.maxPrice
        );
      }
      
      if (params.inStock) {
        filtered = filtered.filter(sweet => 
          sweet.quantity > 0
        );
      }
      
      setTimeout(() => {
        setSweets(filtered);
        setLoading(false);
      }, 500);
    } catch (error) {
      toast.error("Search failed");
      setLoading(false);
    }
  };

  const refreshSweets = async () => {
    setLoading(true);
    setTimeout(() => {
      setSweets(mockSweets);
      setLoading(false);
    }, 500);
  };

  const purchaseSweet = async (sweetId: string, quantity: number) => {
    try {
      setLoading(true);
      // Mock purchase
      setTimeout(() => {
        setSweets(prev => prev.map(sweet => 
          sweet.id === sweetId 
            ? { ...sweet, quantity: Math.max(0, sweet.quantity - quantity) }
            : sweet
        ));
        setLoading(false);
        toast.success("Purchase successful!");
      }, 500);
    } catch (error: any) {
      toast.error(error.message || "Purchase failed");
      setLoading(false);
    }
  };

  const value = {
    sweets,
    loading,
    categories,
    searchSweets,
    refreshSweets,
    purchaseSweet,
  };

  return (
    <SweetContext.Provider value={value}>
      {children}
    </SweetContext.Provider>
  );
};
