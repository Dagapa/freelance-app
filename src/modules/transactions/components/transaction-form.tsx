'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionFormSchema, TransactionFormValues } from '../lib/schema';

const categories = [
  { value: 'salary', label: 'Salario' },
  { value: 'freelance', label: 'Trabajo Freelance' },
  { value: 'investment', label: 'Inversiones' },
  { value: 'other_income', label: 'Otros ingresos' },
  { value: 'food', label: 'Comida' },
  { value: 'transport', label: 'Transporte' },
  { value: 'housing', label: 'Vivienda' },
  { value: 'entertainment', label: 'Entretenimiento' },
  { value: 'shopping', label: 'Compras' },
  { value: 'health', label: 'Salud' },
  { value: 'education', label: 'Educación' },
  { value: 'other_expense', label: 'Otros gastos' },
];

interface TransactionFormProps {
  onSubmit: (values: TransactionFormValues) => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<TransactionFormValues>;
}

export function TransactionForm({
  onSubmit,
  isSubmitting = false,
  defaultValues = {
    type: 'expense',
    date: new Date().toISOString(),
  },
}: TransactionFormProps) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      description: '',
      amount: 0,
      type: 'expense',
      category: '',
      date: new Date().toISOString(),
      notes: '',
      ...defaultValues,
    },
  });

  const transactionType = form.watch('type');

  return (
    <div>Formulario</div>
  );
}
