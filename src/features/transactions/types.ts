export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: TransactionType;
  category: string;
  date: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionDTO {
  amount: number;
  description: string;
  type: TransactionType;
  category: string;
  date: Date;
} 