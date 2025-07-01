import { Transaction } from '@/features/transactions/types'

export function calculateSummary(transactions: Transaction[]) {
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

  return { totalIncome, totalExpenses, netBalance }
}

export function getMonthlyData(transactions: Transaction[]) {
  const today = new Date()
  const monthlyData = []

  for (let i = 0; i < 6; i++) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const monthName = monthDate.toLocaleString('es', { month: 'short' })
    const monthYear = monthDate.getFullYear()
    const monthIndex = monthDate.getMonth()

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

  return monthlyData
}

export function getRecentTransactions(transactions: Transaction[]) {
  return transactions
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
} 