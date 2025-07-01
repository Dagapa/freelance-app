'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@lib/supabase/client';
import { Transaction } from '../types';
import { AddTransactionButton } from './add-transaction-button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@shared/ui/badge';
import { Skeleton } from '@shared/ui/skeleton';

const transactionTypeVariant = {
  income: 'bg-green-100 text-green-800 hover:bg-green-200',
  expense: 'bg-red-100 text-red-800 hover:bg-red-200',
};

const transactionTypeLabel = {
  income: 'Ingreso',
  expense: 'Gasto',
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
};

export function TransactionList() {
  const supabase = createClient();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        throw new Error('Error al cargar las transacciones');
      }

      return data as Transaction[];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          No hay transacciones registradas
        </div>
        <AddTransactionButton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div>
            <div className="font-medium">{transaction.description}</div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(transaction.date), 'PPP', { locale: es })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              className={transactionTypeVariant[transaction.type]}
              variant="outline"
            >
              {transactionTypeLabel[transaction.type]}
            </Badge>
            <div className="font-medium">
              {transaction.type === 'expense' ? '-' : ''}
              {formatCurrency(transaction.amount)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
