import { Transaction } from '@/features/transactions/types'
import { createClient } from '@lib/supabase/server'

export async function getUserTransactions(): Promise<Transaction[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuario no autenticado')
  }

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching transactions:', error)
    throw new Error('Error al obtener las transacciones')
  }

  return transactions as Transaction[]
} 