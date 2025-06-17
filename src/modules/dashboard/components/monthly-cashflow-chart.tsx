'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency } from '../lib/utils'

interface MonthlyData {
  month: string
  income: number
  expenses: number
}

interface MonthlyCashFlowChartProps {
  data: MonthlyData[]
}

export function MonthlyCashFlowChart({ data }: MonthlyCashFlowChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Flujo de Efectivo Mensual</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              labelClassName="text-foreground"
            />
            <Bar
              dataKey="income"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
              name="Ingresos"
            />
            <Bar
              dataKey="expenses"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              name="Gastos"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
