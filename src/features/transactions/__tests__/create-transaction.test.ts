import { createTransaction } from '../actions/create-transaction';

// Mock the Supabase client
const mockFrom = jest.fn().mockReturnThis();
const mockInsert = jest.fn().mockReturnThis();
const mockSelect = jest.fn().mockReturnThis();
const mockSingle = jest.fn().mockResolvedValue({ 
  data: { id: 'test-transaction-id' }, 
  error: null 
});

const mockGetUser = jest.fn().mockResolvedValue({ 
  data: { user: { id: 'test-user-id' } } 
});

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
    insert: mockInsert.mockReturnThis(),
    select: mockSelect.mockReturnThis(),
    single: mockSingle,
  })),
}));

describe('createTransaction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a transaction successfully', async () => {
    const mockTransaction = {
      description: 'Test transaction',
      amount: 1000,
      type: 'expense' as const,
      category: 'food',
      date: new Date().toISOString(),
    };

    const result = await createTransaction(mockTransaction);

    const { createClient } = await import('@/lib/supabase/server');
    expect(createClient).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalledWith('transactions');
    expect(mockInsert).toHaveBeenCalledWith([
      {
        ...mockTransaction,
        user_id: 'test-user-id',
      },
    ]);
    expect(mockSelect).toHaveBeenCalled();
    expect(mockSingle).toHaveBeenCalled();
    expect(result).toEqual({ id: 'test-transaction-id' });
  });

  it('throws an error when user is not authenticated', async () => {
    // Mock unauthenticated user
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });

    const mockTransaction = {
      description: 'Test transaction',
      amount: 1000,
      type: 'expense' as const,
      category: 'food',
      date: new Date().toISOString(),
    };

    await expect(createTransaction(mockTransaction)).rejects.toThrow('Usuario no autenticado');
  });

  it('throws an error when Supabase returns an error', async () => {
    const mockError = new Error('Database error');
    mockSingle.mockResolvedValueOnce({ 
      data: null, 
      error: mockError 
    });

    const mockTransaction = {
      description: 'Test transaction',
      amount: 1000,
      type: 'expense' as const,
      category: 'food',
      date: new Date().toISOString(),
    };

    await expect(createTransaction(mockTransaction)).rejects.toThrow('Error al crear la transacción');
  });
});
