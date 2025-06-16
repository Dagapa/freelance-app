// Funciones utilitarias para el dashboard. Agrega aquí helpers reutilizables.

/**
 * Formatea un número como moneda local (MXN por defecto).
 */
export function formatCurrency(value: number, currency: string = 'COP', locale: string = 'es-CO'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}
