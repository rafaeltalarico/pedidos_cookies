import { create } from 'zustand';
import { supabase, type Order, type OrderWithItems } from '../lib/supabase';

interface OrderState {
  orders: OrderWithItems[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: (isFranchisor: boolean, userId?: string) => Promise<void>;
  getOrder: (orderId: string) => Promise<OrderWithItems | null>;
  updateOrderStatus: (orderId: string, status: 'pending' | 'completed' | 'cancelled') => Promise<void>;
  getAverageProcessingTime: () => Promise<string | null>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrders: async (isFranchisor, userId) => {
    try {
      set({ isLoading: true, error: null });
      
      let query = supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            *,
            product:products(*)
          ),
          franchisee:profiles(*)
        `)
        .order('created_at', { ascending: false });
      
      // If not franchisor, only fetch user's orders
      if (!isFranchisor && userId) {
        query = query.eq('franchisee_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      set({ 
        orders: data as unknown as OrderWithItems[], 
        isLoading: false 
      });
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to fetch orders' 
      });
    }
  },

  getOrder: async (orderId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            *,
            product:products(*)
          ),
          franchisee:profiles(*)
        `)
        .eq('id', orderId)
        .single();
      
      if (error) throw error;
      
      set({ isLoading: false });
      return data as unknown as OrderWithItems;
    } catch (error: any) {
      console.error('Error fetching order:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to fetch order' 
      });
      return null;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;
      
      // Refresh orders
      const { orders } = get();
      const isFranchisor = true; // Assuming this is called by franchisor
      await useOrderStore.getState().fetchOrders(isFranchisor);
    } catch (error: any) {
      console.error('Error updating order status:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to update order status' 
      });
    }
  },

  getAverageProcessingTime: async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_average_processing_time');
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error('Error getting average processing time:', error);
      return null;
    }
  },
}));