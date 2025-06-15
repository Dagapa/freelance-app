import { createClient } from '@/lib/supabase/server'

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
  recentTransactions: Array<{
    id: string
    description: string
    amount: number
    type: 'income' | 'expense'
    date: string
    category: string
  }>
}

export async function getDashboardData(): Promise<DashboardData> {
  const _supabase = await createClient()
  // Aquí puedes hacer consultas a Supabase cuando estés listo
  return {
    summary: {
      totalIncome: 12500,
      totalExpenses: 7500,
      netBalance: 5000,
    },
    monthlyData: [
      { month: 'Ene', income: 4000, expenses: 2400 },
      { month: 'Feb', income: 3000, expenses: 1398 },
      { month: 'Mar', income: 2000, expenses: 9800 },
      { month: 'Abr', income: 2780, expenses: 3908 },
      { month: 'May', income: 1890, expenses: 4800 },
      { month: 'Jun', income: 2390, expenses: 3800 },
    ],
    recentTransactions: [
      {
        id: '1',
        description: 'Pago de cliente',
        amount: 2500,
        type: 'income',
        date: '2023-06-15',
        category: 'Trabajo',
      },
      {
        id: '2',
        description: 'Software',
        amount: 99,
        type: 'expense',
        date: '2023-06-14',
        category: 'Herramientas',
      },
      {
        id: '3',
        description: 'Cafetería',
        amount: 12.5,
        type: 'expense',
        date: '2023-06-13',
        category: 'Comida',
      },
    ],
  }
}
