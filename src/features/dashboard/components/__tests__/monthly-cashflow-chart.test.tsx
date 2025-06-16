import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { MonthlyCashFlowChart } from '../monthly-cashflow-chart';

const data = [
  { month: 'Enero', income: 200000, expenses: 100000 },
  { month: 'Febrero', income: 150000, expenses: 120000 },
];

describe('MonthlyCashFlowChart', () => {
  it('renderiza el gráfico sin errores', () => {
    render(<MonthlyCashFlowChart data={data} />);
    // No hay asserts estrictos porque es un gráfico, pero no debe fallar
  });
});
