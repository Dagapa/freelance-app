import { z } from 'zod';
import { TransactionType } from '../types';

export const transactionFormSchema = z.object({
  description: z.string().min(3, 'La descripción debe tener al menos 3 caracteres'),
  amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  type: z.enum(['income', 'expense']) as z.ZodType<TransactionType>,
  category: z.string().min(1, 'La categoría es requerida'),
  date: z.string().datetime({ offset: true }),
  notes: z.string().optional(),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
