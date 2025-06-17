export type TransactionType = 'income' | 'expense';

/**
 * Matches the transactions table schema:
 * - id: uuid default uuid_generate_v4() primary key
 * - user_id: uuid references auth.users not null
 * - amount: decimal not null
 * - description: text not null
 * - type: text not null check (type in ('income', 'expense'))
 * - category: text not null
 * - date: timestamp with time zone not null
 * - created_at: timestamp with time zone default now()
 * - updated_at: timestamp with time zone default now()
 */
export interface CreateTransactionDTO {
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface Transaction extends CreateTransactionDTO {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}
