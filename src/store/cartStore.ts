import { create } from 'zustand';
import { supabase, type Product } from '../lib/supabase';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  submitOrder: (franchiseeId: string) => Promise<string | null>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  addItem: (product, quantity) => {
    set((state) => {
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return {
          items: state.items.map(item => 
            item.product.id === product.id 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        };
      } else {
        return {
          items: [...state.items, { product, quantity }]
        };
      }
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter(item => item.product.id !== productId)
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    
    set((state) => ({
      items: state.items.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      )
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  submitOrder: async (franchiseeId) => {
    const { items } = get();
    
    if (items.length === 0) {
      set({ error: 'Your cart is empty' });
      return null;
    }
    
    try {
      set({ isLoading: true, error: null });
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          franchisee_id: franchiseeId,
          status: 'pending',
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      // Clear cart after successful order
      get().clearCart();
      set({ isLoading: false });
      
      return order.id;
    } catch (error: any) {
      console.error('Order submission error:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to submit order' 
      });
      return null;
    }
  },
}));