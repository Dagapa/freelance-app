import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { TransactionItem } from './transaction-item'

export interface Transaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  date: string
  category: string
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transacciones Recientes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.length === 0 ? (
          <div className="text-center text-muted-foreground">No hay transacciones recientes.</div>
        ) : (
          transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))
        )}
        <div className="mt-4 text-center">
          <button className="text-sm font-medium text-primary hover:underline">
            Ver todas las transacciones
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
