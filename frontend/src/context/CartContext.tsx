import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import api from '../api/config';
import { AuthContext } from './AuthContext';

interface CartItem {
  cart_id: number;
  id: number; // bull id
  name: string;
  breed: string;
  semen_price: number;
  quantity: number;
  image_url: string;
}

interface CartContextType {
  cartItems: CartItem[];
  fetchCart: () => void;
  addToCart: (bullId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartId: number) => Promise<void>;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  fetchCart: () => { },
  addToCart: async () => { },
  removeFromCart: async () => { },
  clearCart: () => { },
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useContext(AuthContext);

  const fetchCart = async () => {
    if (!user || user.role !== 'farmer') return;
    try {
      const response = await api.get(`/cart/${user.id}`);
      setCartItems(response.data);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    }
  };

  useEffect(() => {
    if (user && user.role === 'farmer') {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const addToCart = async (bullId: number, quantity: number) => {
    try {
      await api.post('/cart', { bull_id: bullId, quantity });
      fetchCart();
    } catch (error) {
      console.error('Failed to add to cart', error);
      throw error;
    }
  };

  const removeFromCart = async (cartId: number) => {
    try {
      await api.delete(`/cart/${cartId}`);
      fetchCart();
    } catch (error) {
      console.error('Failed to remove from cart', error);
      throw error;
    }
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, fetchCart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
