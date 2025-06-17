import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TransactionForm } from '../components/transaction-form';
import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockOnSubmit = vi.fn();

describe('TransactionForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form with all fields', () => {
    render(<TransactionForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/tipo de transacción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/monto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/categoría/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fecha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notas/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<TransactionForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/la descripción es requerida/i)).toBeInTheDocument();
      expect(screen.getByText(/el monto es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/la categoría es requerida/i)).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits the form with valid data', async () => {
    // Mock the form with pre-filled values to avoid UI interaction issues
    const mockValues = {
      description: 'Pago de cliente',
      amount: 1000,
      type: 'expense' as const, // Type assertion to match TransactionType
      category: 'food', // Valid category for expense
      date: new Date().toISOString(),
      notes: '',
    };
    
    // Create a custom onSubmit that will be called with our mock values
    const customOnSubmit = vi.fn();
    
    render(
      <TransactionForm 
        onSubmit={customOnSubmit} 
        defaultValues={mockValues} 
      />
    );
    
    // Verify fields are pre-filled
    expect(screen.getByLabelText(/descripción/i)).toHaveValue('Pago de cliente');
    expect(screen.getByLabelText(/monto/i)).toHaveValue(1000);
    
    // Submit the form with the pre-filled values
    const submitButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(submitButton);
    
    // Verify the form was submitted with the expected values
    await waitFor(() => {
      expect(customOnSubmit).toHaveBeenCalledWith(mockValues, expect.anything());
    });
  });

  it('filters categories based on transaction type', async () => {
    render(<TransactionForm onSubmit={mockOnSubmit} />);
    
    // Initially, expense categories should be shown
    const categorySelect = screen.getByLabelText(/categoría/i);
    fireEvent.click(categorySelect);
    
    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options.length).toBeGreaterThan(0);
    });
    
    expect(screen.queryByRole('option', { name: /salario/i })).not.toBeInTheDocument();
    
    // Change to income type
    const typeSelect = screen.getByLabelText(/tipo de transacción/i);
    fireEvent.click(typeSelect);
    
    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options.length).toBeGreaterThan(0);
    });
    
    const incomeOption = screen.getByRole('option', { name: /ingreso/i });
    fireEvent.click(incomeOption);
    
    // Now income categories should be shown
    fireEvent.click(categorySelect);
    
    await waitFor(() => {
      expect(screen.getByRole('option', { name: /salario/i })).toBeInTheDocument();
    });
  });
});
