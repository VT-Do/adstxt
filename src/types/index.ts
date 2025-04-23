
export type UserRole = 'admin' | 'viewer';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface SheetDataRow {
  id: string;
  sheet_id: string;
  row_data: Record<string, any>;
  created_at: string;
  updated_by?: string;
  created_by?: string;
}
