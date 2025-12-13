import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category: string;
  maxQuantity: number; // Available stock
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage on initial render
    const savedCart = localStorage.getItem('sweetShopCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sweetShopCart', JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(i => i.id === item.id);
      
      if (existingItem) {
        // If item already in cart, check stock limit
        if (existingItem.quantity >= item.maxQuantity) {
          toast.error(`Cannot add more. Only ${item.maxQuantity} available in stock.`);
          return currentItems;
        }
        
        // Increase quantity
        const updatedItems = currentItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
        
        toast.success(`Added another ${item.name} to cart!`);
        return updatedItems;
      } else {
        // Add new item with quantity 1
        const newItem = { ...item, quantity: 1 };
        toast.success(`Added ${item.name} to cart!`);
        return [...currentItems, newItem];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setItems(currentItems => {
      const item = currentItems.find(i => i.id === id);
      if (item) {
        toast.success(`Removed ${item.name} from cart`);
      }
      return currentItems.filter(item => item.id !== id);
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }

    setItems(currentItems => {
      const item = currentItems.find(i => i.id === id);
      if (!item) return currentItems;

      // Check stock limit
      if (quantity > item.maxQuantity) {
        toast.error(`Cannot add more. Only ${item.maxQuantity} available in stock.`);
        return currentItems.map(i =>
          i.id === id ? { ...i, quantity: item.maxQuantity } : i
        );
      }

      return currentItems.map(i =>
        i.id === id ? { ...i, quantity } : i
      );
    });
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared!');
  };

  const getItemQuantity = (id: string) => {
    const item = items.find(i => i.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider value={{
      items,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemQuantity,
    }}>
      {children}
    </CartContext.Provider>
  );
};