import { create } from 'zustand';
import { supabase, type Product } from '../lib/supabase';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      set({ 
        products: data as Product[], 
        isLoading: false 
      });
    } catch (error: any) {
      console.error('Error fetching products:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to fetch products' 
      });
    }
  },

  addProduct: async (product) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('products')
        .insert(product);
      
      if (error) throw error;
      
      // Refresh products list
      await useProductStore.getState().fetchProducts();
    } catch (error: any) {
      console.error('Error adding product:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to add product' 
      });
    }
  },

  updateProduct: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh products list
      await useProductStore.getState().fetchProducts();
    } catch (error: any) {
      console.error('Error updating product:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to update product' 
      });
    }
  },
}));