import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TransactionForm } from '../components/transaction-form';

const mockOnSubmit = jest.fn();

describe('TransactionForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with all fields', () => {
    render(<TransactionForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/tipo de transacción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/monto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/categoría/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fecha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notas/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guardar transacción/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<TransactionForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /guardar transacción/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/la descripción debe tener al menos 3 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/el monto debe ser mayor a 0/i)).toBeInTheDocument();
      expect(screen.getByText(/la categoría es requerida/i)).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits the form with valid data', async () => {
    render(<TransactionForm onSubmit={mockOnSubmit} />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/descripción/i), { 
      target: { value: 'Pago de cliente' } 
    });
    
    fireEvent.change(screen.getByLabelText(/monto/i), { 
      target: { value: '1000' } 
    });
    
    // Select category
    fireEvent.click(screen.getByLabelText(/categoría/i));
    const categoryOption = await screen.findByText('Trabajo Freelance');
    fireEvent.click(categoryOption);
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /guardar transacción/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        description: 'Pago de cliente',
        amount: 1000,
        type: 'expense',
        category: 'freelance',
        date: expect.any(String),
        notes: '',
      }, expect.anything());
    });
  });

  it('filters categories based on transaction type', async () => {
    render(<TransactionForm onSubmit={mockOnSubmit} />);
    
    // Initially, expense categories should be shown
    fireEvent.click(screen.getByLabelText(/categoría/i));
    expect(screen.queryByText('Salario')).not.toBeInTheDocument();
    
    // Change to income type
    fireEvent.click(screen.getByLabelText(/tipo de transacción/i));
    const incomeOption = await screen.findByText('Ingreso');
    fireEvent.click(incomeOption);
    
    // Now income categories should be shown
    fireEvent.click(screen.getByLabelText(/categoría/i));
    expect(screen.getByText('Salario')).toBeInTheDocument();
  });
});
