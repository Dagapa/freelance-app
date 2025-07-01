import { Transaction } from '@/features/transactions/types'
import { getUserTransactions } from '../services/transactionsService'
import { calculateSummary, getMonthlyData, getRecentTransactions } from '../lib/dashboardUtils'

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
  const transactions = await getUserTransactions()

  return {
    summary: calculateSummary(transactions),
    monthlyData: getMonthlyData(transactions),
    recentTransactions: getRecentTransactions(transactions)
  }
}
