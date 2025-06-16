'use server';

import { createClient } from '@/lib/supabase/server';
import { CreateTransactionDTO } from '../types';

export async function createTransaction(transaction: CreateTransactionDTO) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert([
      {
        ...transaction,
        user_id: user.id,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating transaction:', error);
    throw new Error('Error al crear la transacción');
  }

  // Convert to plain object to ensure serialization
  return JSON.parse(JSON.stringify(data));
}
