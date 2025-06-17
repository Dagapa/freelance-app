'use client';

import { TransactionForm } from './transaction-form';
import { useCreateTransaction } from '../hooks/use-create-transaction';

export function AddTransactionModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate: createTransaction, isPending } = useCreateTransaction();

  const handleSubmit = (values: any) => {
    createTransaction(values, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <div onClick={() => onOpenChange(false)}>
      <div className="sm:max-w-[425px]">
        <header>
          <h2>Agregar transacción</h2>
        </header>
        <TransactionForm onSubmit={handleSubmit} isSubmitting={isPending} />
      </div>
    </div>
  );
}
