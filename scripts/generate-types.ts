import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

// Cargar variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define the Json type that will be used in the type generation
type JsonType = string | number | boolean | null | { [key: string]: JsonType | undefined } | JsonType[];

// Define types for the database schema
interface DatabaseFunction {
  Args: Record<string, unknown>;
  Returns: unknown;
}

interface DatabaseView {
  Row: Record<string, JsonType>;
}

interface DatabaseTable {
  Row: Record<string, JsonType>;
  Insert: Record<string, JsonType>;
  Update: Record<string, JsonType>;
}

interface DatabaseSchema {
  tables: Record<string, DatabaseTable>;
  views: Record<string, DatabaseView>;
  functions: Record<string, DatabaseFunction>;
  enums: Record<string, string[]>;
}

async function generateTypes() {
  try {
    // Obtener el esquema de la base de datos
    const { data, error } = await supabase.rpc('get_schema');
    
    if (error) {
      throw error;
    }

    // Type assertion for the data
    const schemaData = data as unknown as DatabaseSchema;

    // Generate the Json type definition as a string
    const jsonTypeDefinition = `// Generated types for Supabase

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]
`;

    // Generate the database types
    const databaseTypes = `
export interface Database {
  public: {
    Tables: {
      ${Object.entries(schemaData.tables || {}).map(([tableName, table]) => {
        return `${tableName}: {
          Row: ${JSON.stringify(table.Row, null, 2)}
          Insert: ${JSON.stringify(table.Insert, null, 2)}
          Update: ${JSON.stringify(table.Update, null, 2)}
        }`;
      }).join('\n\n      ')}
    }
    Views: {
      ${Object.entries(schemaData.views || {}).map(([viewName, view]) => {
        return `${viewName}: {
          Row: ${JSON.stringify(view.Row, null, 2)}
        }`;
      }).join('\n\n      ')}
    }
    Functions: {
      ${Object.entries(schemaData.functions || {}).map(([fnName, fn]: [string, DatabaseFunction]) => {
        return `${fnName}: {
          Args: ${JSON.stringify(fn.Args, null, 2)}
          Returns: ${JSON.stringify(fn.Returns, null, 2)}
        }`;
      }).join('\n\n      ')}
    }
    Enums: {
      ${Object.entries(schemaData.enums || {}).map(([enumName, values]) => {
        return `${enumName}: ${JSON.stringify(values, null, 2)}`;
      }).join('\n\n      ')}
    }
  }
}
`;

    // Combine all type definitions
    const types = `${jsonTypeDefinition}${databaseTypes}`;
    
    // Escribir los tipos en un archivo
    const outputPath = resolve(__dirname, '../src/lib/supabase/database.types.ts');
    writeFileSync(outputPath, types, 'utf-8');
    
    console.log(`Types generated successfully at ${outputPath}`);
  } catch (error) {
    console.error('Error generating types:', error);
    process.exit(1);
  }
}

generateTypes();
