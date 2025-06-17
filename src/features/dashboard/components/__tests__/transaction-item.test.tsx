import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { TransactionItem } from '../transaction-item';
import type { Transaction } from '../recent-transactions';

describe('TransactionItem', () => {
  test('muestra correctamente un ingreso', () => {
    const transaction: Transaction = {
      id: '1',
      description: 'Pago cliente',
      amount: 100000,
      type: 'income',
      date: '2025-06-01',
      category: 'Servicios',
    };
    render(<TransactionItem transaction={transaction} />);
    expect(screen.getByText(/Pago cliente/i)).toBeInTheDocument();
    expect(screen.getByText(/Servicios/i)).toBeInTheDocument();
    expect(screen.getByText(/\+\$\s?100.000/)).toBeInTheDocument();
    // expect(screen.getByLabelText(/arrow-up-circle/i)).toBeInTheDocument();
  });

  test('muestra correctamente un gasto', () => {
    const transaction: Transaction = {
      id: '2',
      description: 'Compra insumos',
      amount: 50000,
      type: 'expense',
      date: '2025-06-02',
      category: 'Gastos',
    };
    render(<TransactionItem transaction={transaction} />);
    expect(screen.getByText(/Compra insumos/i)).toBeInTheDocument();
    expect(screen.getByText(/Gastos/i)).toBeInTheDocument();
    expect(screen.getByText(/-\$\s?50.000/)).toBeInTheDocument();
    // expect(screen.getByLabelText(/arrow-down-circle/i)).toBeInTheDocument();
  });
});
