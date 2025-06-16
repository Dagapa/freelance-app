export type TransactionType = 'income' | 'expense';

export interface CreateTransactionDTO {
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}
