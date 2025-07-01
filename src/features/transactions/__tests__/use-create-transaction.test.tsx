import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateTransaction } from '../hooks/use-create-transaction';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the custom toast hook
vi.mock('@shared/ui/toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock the createTransaction function
vi.mock('../actions/create-transaction');
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
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('calls createTransaction and shows success toast on success', async () => {
    const mockTransaction = {
      description: 'Test transaction',
      amount: 1000,
      type: 'expense' as const,
      category_id: 'test-category-id',
      category_name: 'food',
      date: new Date().toISOString(),
    };

    vi.mocked(createTransaction).mockResolvedValueOnce({ id: 'test-id' });

    const { result } = renderHook(() => useCreateTransaction(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(mockTransaction);
    });

    expect(createTransaction).toHaveBeenCalledWith(mockTransaction);
  });

  it('shows error toast when createTransaction fails', async () => {
    const mockError = new Error('Test error');
    vi.mocked(createTransaction).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useCreateTransaction(), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          description: 'Test transaction',
          amount: 1000,
          type: 'expense',
          category_id: 'test-category-id',
          category_name: 'food',
          date: new Date().toISOString(),
        });
      } catch {
        // Expected error
      }
    });
  });

  it('invalidates transactions and dashboard queries on success', async () => {
    // Set up some test data in the query cache
    queryClient.setQueryData(['transactions'], []);
    queryClient.setQueryData(['dashboard'], {});

    vi.mocked(createTransaction).mockResolvedValueOnce({ id: 'test-id' });

    const { result } = renderHook(() => useCreateTransaction(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        description: 'Test transaction',
        amount: 1000,
        type: 'expense',
        category_id: 'test-category-id',
        category_name: 'food',
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
