import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { formatCurrency } from '../lib/utils'
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react'

interface SummaryCardProps {
  title: string
  value: number
  description: string
  icon: React.ReactNode
  variant?: 'default' | 'success' | 'destructive'
}

const SummaryCard = ({
  title,
  value,
  description,
  icon,
  variant = 'default',
}: SummaryCardProps) => {
  const variantClasses = {
    default: 'bg-card',
    success: 'bg-green-50 dark:bg-green-900/20',
    destructive: 'bg-red-50 dark:bg-red-900/20',
  }

  return (
    <Card className={variantClasses[variant]}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(value)}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

interface DashboardSummaryCardsProps {
  data: {
    totalIncome: number
    totalExpenses: number
    netBalance: number
  }
}

export function DashboardSummaryCards({ data }: DashboardSummaryCardsProps) {
  return (
    <>
      <SummaryCard
        title="Ingresos"
        value={data.totalIncome}
        description="+20% desde el mes pasado"
        icon={<TrendingUp className="h-4 w-4 text-green-500" />}
        variant="success"
      />
      <SummaryCard
        title="Gastos"
        value={data.totalExpenses}
        description="+5% desde el mes pasado"
        icon={<TrendingDown className="h-4 w-4 text-red-500" />}
        variant="destructive"
      />
      <SummaryCard
        title="Balance Neto"
        value={data.netBalance}
        description="Total disponible"
        icon={<Wallet className="h-4 w-4 text-blue-500" />}
      />
    </>
  )
}
