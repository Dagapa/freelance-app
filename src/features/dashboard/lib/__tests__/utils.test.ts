import { formatCurrency } from '../utils';

describe('formatCurrency', () => {
  it('formatea correctamente a COP colombiano', () => {
    expect(formatCurrency(1000000)).toBe('$ 1.000.000,00');
    expect(formatCurrency(50000)).toBe('$ 50.000,00');
  });
});
