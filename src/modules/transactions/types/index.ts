export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // ISO date string
  notes?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionDTO {
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  notes?: string;
}
