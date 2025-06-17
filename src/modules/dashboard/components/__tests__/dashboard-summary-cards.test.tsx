import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardSummaryCards } from '../dashboard-summary-cards';

describe('DashboardSummaryCards', () => {
  it('muestra los valores correctamente formateados', () => {
    const data = {
      totalIncome: 1000000,
      totalExpenses: 500000,
      netBalance: 500000,
    };
    render(<DashboardSummaryCards data={data} />);
    expect(screen.getByText(/Ingresos/i)).toBeInTheDocument();
    expect(screen.getByText(/Gastos/i)).toBeInTheDocument();
    expect(screen.getByText(/Balance Neto/i)).toBeInTheDocument();
    expect(screen.getAllByText(/\$\s?1.000.000/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/\$\s?500.000/)[0]).toBeInTheDocument();
  });
});
