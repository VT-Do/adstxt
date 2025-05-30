export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      column_visibility_settings: {
        Row: {
          created_at: string
          hidden_columns: string[]
          id: string
          role: string
          tab: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          hidden_columns?: string[]
          id?: string
          role: string
          tab: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          hidden_columns?: string[]
          id?: string
          role?: string
          tab?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sheet_data: {
        Row: {
          created_at: string | null
          data: Json
          id: string
        }
        Insert: {
          created_at?: string | null
          data: Json
          id?: string
        }
        Update: {
          created_at?: string | null
          data?: Json
          id?: string
        }
        Relationships: []
      }
      test2: {
        Row: {
          "Bid opportunity": number | null
          Key: string | null
          LINE: string | null
          PRIMARY: string | null
          Revenue: number | null
          RPMO: number | null
          Seller: string | null
          "Supply market": string | null
        }
        Insert: {
          "Bid opportunity"?: number | null
          Key?: string | null
          LINE?: string | null
          PRIMARY?: string | null
          Revenue?: number | null
          RPMO?: number | null
          Seller?: string | null
          "Supply market"?: string | null
        }
        Update: {
          "Bid opportunity"?: number | null
          Key?: string | null
          LINE?: string | null
          PRIMARY?: string | null
          Revenue?: number | null
          RPMO?: number | null
          Seller?: string | null
          "Supply market"?: string | null
        }
        Relationships: []
      }
      test3: {
        Row: {
          category: string | null
          created_at: string | null
          id: number
          is_active: boolean | null
          name: string
          value: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          value?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          value?: number | null
        }
        Relationships: []
      }
      test4: {
        Row: {
          category: string | null
          created_at: string | null
          id: number
          is_active: boolean | null
          name: string | null
          value: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id: number
          is_active?: boolean | null
          name?: string | null
          value?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name?: string | null
          value?: number | null
        }
        Relationships: []
      }
      Upload: {
        Row: {
          Account: string | null
          Division: string | null
          ID: number | null
          Line: string | null
          Primary_: boolean | null
          "SELLER DOMAIN": string | null
          "SELLER NAME": string | null
          "SELLER TYPE": string | null
          SSP: string | null
          Type: string | null
          Weight: string | null
        }
        Insert: {
          Account?: string | null
          Division?: string | null
          ID?: number | null
          Line?: string | null
          Primary_?: boolean | null
          "SELLER DOMAIN"?: string | null
          "SELLER NAME"?: string | null
          "SELLER TYPE"?: string | null
          SSP?: string | null
          Type?: string | null
          Weight?: string | null
        }
        Update: {
          Account?: string | null
          Division?: string | null
          ID?: number | null
          Line?: string | null
          Primary_?: boolean | null
          "SELLER DOMAIN"?: string | null
          "SELLER NAME"?: string | null
          "SELLER TYPE"?: string | null
          SSP?: string | null
          Type?: string | null
          Weight?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
