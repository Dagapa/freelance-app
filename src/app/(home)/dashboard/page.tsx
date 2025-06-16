import { Suspense } from 'react'
import { DashboardSummaryCards } from '@/features/dashboard/components/dashboard-summary-cards'
import { MonthlyCashFlowChart } from '@/features/dashboard/components/monthly-cashflow-chart'
import { RecentTransactions } from '@/features/dashboard/components/recent-transactions'
import { getDashboardData } from '@/features/dashboard/actions/get-dashboard-data'
import { DashboardSkeleton } from '@/features/dashboard/components/dashboard-skeleton'

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
        <p className="text-muted-foreground">
          Resumen de tus finanzas personales
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardSummaryCards data={data.summary} />
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <MonthlyCashFlowChart data={data.monthlyData} />
          <RecentTransactions transactions={data.recentTransactions} />
        </div>
      </Suspense>
    </div>
  )
}
