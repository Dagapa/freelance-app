import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateTransaction } from '../hooks/use-create-transaction';
import { toast } from 'sonner';

// Mock the toast function
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock the createTransaction function
jest.mock('../actions/create-transaction');
import { createTransaction } from '../actions/create-transaction';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useCreateTransaction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('calls createTransaction and shows success toast on success', async () => {
    const mockTransaction = {
      description: 'Test transaction',
      amount: 1000,
      type: 'expense' as const,
      category: 'food',
      date: new Date().toISOString(),
    };

    (createTransaction as jest.Mock).mockResolvedValueOnce({ id: 'test-id' });

    const { result } = renderHook(() => useCreateTransaction(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(mockTransaction);
    });

    expect(createTransaction).toHaveBeenCalledWith(mockTransaction);
    expect(toast.success).toHaveBeenCalledWith('¡Transacción creada!', {
      description: 'La transacción se ha guardado correctamente.',
    });
  });

  it('shows error toast when createTransaction fails', async () => {
    const mockError = new Error('Test error');
    (createTransaction as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useCreateTransaction(), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          description: 'Test transaction',
          amount: 1000,
          type: 'expense',
          category: 'food',
          date: new Date().toISOString(),
        });
      } catch {
        // Expected error
      }
    });

    expect(toast.error).toHaveBeenCalledWith('Error', {
      description: 'No se pudo guardar la transacción. Por favor, inténtalo de nuevo.',
    });
  });

  it('invalidates transactions and dashboard queries on success', async () => {
    // Set up some test data in the query cache
    queryClient.setQueryData(['transactions'], []);
    queryClient.setQueryData(['dashboard'], {});

    (createTransaction as jest.Mock).mockResolvedValueOnce({ id: 'test-id' });

    const { result } = renderHook(() => useCreateTransaction(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        description: 'Test transaction',
        amount: 1000,
        type: 'expense',
        category: 'food',
        date: new Date().toISOString(),
      });
    });

    // The queries should be invalidated
    const transactionsQuery = queryClient.getQueryState(['transactions']);
    const dashboardQuery = queryClient.getQueryState(['dashboard']);

    expect(transactionsQuery?.isInvalidated).toBe(true);
    expect(dashboardQuery?.isInvalidated).toBe(true);
  });
});
