export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      celebrities: {
        Row: {
          id: string;
          name: string;
          category: string | null;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          category?: string | null;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string | null;
          created_at?: string;
          created_by?: string | null;
        };
      };
      lycee_classes: {
        Row: {
          id: string;
          name: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          order_index: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          order_index?: number;
          created_at?: string;
        };
      };
      lycee_entries: {
        Row: {
          id: string;
          class_id: string;
          name: string;
          info: string | null;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          class_id: string;
          name: string;
          info?: string | null;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          class_id?: string;
          name?: string;
          info?: string | null;
          created_at?: string;
          created_by?: string | null;
        };
      };
    };
  };
}
