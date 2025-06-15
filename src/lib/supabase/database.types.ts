// Tipos temporales para la base de datos
// Estos serán reemplazados por los tipos generados automáticamente

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type TableSchema = {
  Row: Record<string, unknown>;
  Insert: Record<string, unknown>;
  Update: Record<string, unknown>;
}

type ViewSchema = {
  Row: Record<string, unknown>;
}

type FunctionSchema = {
  Args: Record<string, unknown>;
  Returns: unknown;
}

type EnumSchema = string[];

export interface Database {
  public: {
    Tables: Record<string, TableSchema>;
    Views: Record<string, ViewSchema>;
    Functions: Record<string, FunctionSchema>;
    Enums: Record<string, EnumSchema>;
  };
}
