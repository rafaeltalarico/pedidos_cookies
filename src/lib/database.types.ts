export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          user_type: 'franchisee' | 'franchisor'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          user_type: 'franchisee' | 'franchisor'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          user_type?: 'franchisee' | 'franchisor'
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          sku: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          sku: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          sku?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          franchisee_id: string
          status: 'pending' | 'completed' | 'cancelled'
          created_at: string
          completed_at: string | null
          processing_time: string | null
        }
        Insert: {
          id?: string
          franchisee_id: string
          status?: 'pending' | 'completed' | 'cancelled'
          created_at?: string
          completed_at?: string | null
          processing_time?: string | null
        }
        Update: {
          id?: string
          franchisee_id?: string
          status?: 'pending' | 'completed' | 'cancelled'
          created_at?: string
          completed_at?: string | null
          processing_time?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
        }
      }
    }
  }
}