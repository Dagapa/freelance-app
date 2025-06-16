import { AddTransactionButton, TransactionList } from '@/features/transactions';

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transacciones</h1>
          <p className="text-muted-foreground">
            Gestiona tus ingresos y gastos
          </p>
        </div>
        <AddTransactionButton />
      </div>
      
      <div className="bg-card rounded-lg border p-6">
        <TransactionList />
      </div>
    </div>
  );
}
