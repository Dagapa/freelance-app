import { z } from 'zod';
import type { TransactionType } from '../types';

// Schema matches the database structure:
// id, user_id, amount, description, type, category, date, created_at, updated_at
export const transactionFormSchema = z.object({
  description: z.string().min(1, 'La descripción es requerida'),
  amount: z.number().min(0.01, 'El monto es requerido'),
  type: z.enum(['income', 'expense']) as z.ZodType<TransactionType>,
  category: z.string().min(1, 'La categoría es requerida'),
  date: z.string().datetime({ offset: true }),
  // Notes field is kept in the form for user convenience but won't be stored in DB
  notes: z.string().optional(),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
