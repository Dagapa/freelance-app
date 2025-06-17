'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTransaction } from '../actions/create-transaction';
import { CreateTransactionDTO } from '../types';
import { toast } from 'sonner';

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateTransactionDTO) => {
      const result = await createTransaction(data);
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      toast.success('¡Transacción creada!', {
        description: 'La transacción se ha guardado correctamente.',
      });
    },
    onError: (error: Error) => {
      console.error('Error creating transaction:', error);
      toast.error('Error', {
        description: 'No se pudo guardar la transacción. Por favor, inténtalo de nuevo.',
      });
    },
  });
}
