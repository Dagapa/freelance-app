import { Transaction } from '@/features/transactions/types'
import { createClient } from '@lib/supabase/server'

interface DashboardData {
  summary: {
    totalIncome: number
    totalExpenses: number
    netBalance: number
  }
  monthlyData: Array<{
    month: string
    income: number
    expenses: number
  }>
  recentTransactions: Transaction[]
}

export async function getDashboardData(): Promise<DashboardData> {
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

  // Calculate summary data
  let totalIncome = 0
  let totalExpenses = 0

  transactions.forEach((transaction) => {
    if (transaction.type === 'income') {
      totalIncome += Number(transaction.amount)
    } else {
      totalExpenses += Number(transaction.amount)
    }
  })

  const netBalance = totalIncome - totalExpenses

  // Generate monthly data (last 6 months)
  const today = new Date()
  const monthlyData = []

  for (let i = 0; i < 6; i++) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const monthName = monthDate.toLocaleString('es', { month: 'short' })
    const monthYear = monthDate.getFullYear()
    const monthIndex = monthDate.getMonth()

    // Filter transactions for this month
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate.getMonth() === monthIndex &&
        transactionDate.getFullYear() === monthYear
    })

    let monthlyIncome = 0
    let monthlyExpenses = 0

    monthTransactions.forEach(t => {
      if (t.type === 'income') {
        monthlyIncome += Number(t.amount)
      } else {
        monthlyExpenses += Number(t.amount)
      }
    })

    monthlyData.unshift({
      month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      income: monthlyIncome,
      expenses: monthlyExpenses
    })
  }

  const recentTransactions = transactions
    .slice(0, 5)
    .map((t: Transaction) => ({
      id: t.id,
      description: t.description,
      amount: Number(t.amount),
      type: t.type,
      date: t.date,
      category_name: t.category_name,
      user_id: t.user_id,
      created_at: t.created_at,
      updated_at: t.updated_at,
      category_id: t.category_id
    }))

  return {
    summary: {
      totalIncome,
      totalExpenses,
      netBalance
    },
    monthlyData,
    recentTransactions
  }
}
