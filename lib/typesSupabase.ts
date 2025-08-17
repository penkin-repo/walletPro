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
      cards: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          number: string;
          is_qr_code: boolean;
          color: string;
          image_url: string | null;
          open_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          number: string;
          is_qr_code?: boolean;
          color: string;
          image_url?: string | null;
          open_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          number?: string;
          is_qr_code?: boolean;
          color?: string;
          image_url?: string | null;
          open_count?: number;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
