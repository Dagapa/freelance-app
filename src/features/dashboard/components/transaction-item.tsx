import React from 'react';
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { formatCurrency } from '../lib/utils'
import type { Transaction } from './recent-transactions'

interface TransactionItemProps {
  transaction: Transaction
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  return (
    <div className="flex items-center">
      <div className="mr-4">
        {transaction.type === 'income' ? (
          <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
            <ArrowUpCircle className="h-5 w-5 text-green-500" />
          </div>
        ) : (
          <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/30">
            <ArrowDownCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{transaction.description}</p>
        <p className="text-xs text-muted-foreground">
          {transaction.category} • {format(new Date(transaction.date), 'd MMM', { locale: es })}
        </p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-medium ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
          {transaction.type === 'income' ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </p>
      </div>
    </div>
  )
}
