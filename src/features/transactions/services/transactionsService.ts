import { CreateTransactionDTO, Transaction } from '../types'
import { createClient } from '@lib/supabase/server'

export async function createTransactionInDb(userId: string, transaction: CreateTransactionDTO): Promise<Transaction> {
  const supabase = await createClient()

  const transactionData = {
    user_id: userId,
    description: transaction.description,
    amount: typeof transaction.amount === 'string' ? parseFloat(transaction.amount) : transaction.amount,
    type: transaction.type,
    category_id: transaction.category_id,
    category_name: transaction.category_name,
    date: new Date(transaction.date).toISOString()
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert([transactionData])
    .select()
    .single()

  if (error) {
    console.error('Supabase error creating transaction:', error)
    throw new Error(`Error al crear la transacción: ${error.message}`)
  }

  return data as Transaction
} 