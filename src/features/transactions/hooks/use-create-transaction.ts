'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTransaction } from '../actions/create-transaction';
import { CreateTransactionDTO } from '../types';
import { useToast } from '@shared/ui/toast';

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: CreateTransactionDTO) => {
      const result = await createTransaction(data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      toast({
        title: '¡Transacción creada!',
        description: 'La transacción se ha guardado correctamente.',
        variant: 'success'
      });
    },
    onError: (error: Error) => {
      console.error('Error creating transaction:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la transacción. Por favor, inténtalo de nuevo.',
        variant: 'destructive'
      });
    },
  });
}
