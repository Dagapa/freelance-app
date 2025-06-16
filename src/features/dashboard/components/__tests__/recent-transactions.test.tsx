import { render, screen } from '@testing-library/react';
import { RecentTransactions } from '../recent-transactions';

import type { Transaction } from '../recent-transactions';

const transactions: Transaction[] = [
  { id: '1', description: 'Pago cliente', amount: 100000, type: 'income', date: '2025-06-01', category: 'Servicios' },
  { id: '2', description: 'Compra insumos', amount: 50000, type: 'expense', date: '2025-06-02', category: 'Gastos' },
];

describe('RecentTransactions', () => {
  it('muestra las transacciones recientes con formato correcto', () => {
    render(<RecentTransactions transactions={transactions} />);
    expect(screen.getByText(/Pago cliente/i)).toBeInTheDocument();
    expect(screen.getByText(/Compra insumos/i)).toBeInTheDocument();
    expect(screen.getAllByText(/\$\s?100.000/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/\$\s?50.000/)[0]).toBeInTheDocument();
  });
});
