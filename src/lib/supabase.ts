import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  user_type: 'franchisee' | 'franchisor';
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  franchisee_id: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  completed_at: string | null;
  processing_time: string | null;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product?: Product;
};

export type OrderWithItems = Order & {
  items: (OrderItem & { product: Product })[];
  franchisee?: Profile;
};