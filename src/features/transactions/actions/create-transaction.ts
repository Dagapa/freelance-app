'use server';

import { createClient } from '@lib/supabase/server';
import { CreateTransactionDTO } from '../types';

export async function createTransaction(transaction: CreateTransactionDTO) {
  try {
    console.log('createTransaction');
    console.log(transaction);
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    if (!transaction.description || !transaction.amount || !transaction.type || !transaction.category_id || !transaction.category_name || !transaction.date) {
      console.error('Missing required fields:', {
        hasDescription: !!transaction.description,
        hasAmount: !!transaction.amount,
        hasType: !!transaction.type,
        hasCategoryId: !!transaction.category_id,
        hasCategoryName: !!transaction.category_name,
        hasDate: !!transaction.date
      });
      throw new Error('Faltan campos requeridos');
    }

    const transactionData = {
      user_id: user.id,
      description: transaction.description,
      amount: typeof transaction.amount === 'string' ? parseFloat(transaction.amount) : transaction.amount,
      type: transaction.type,
      category_id: transaction.category_id,
      category_name: transaction.category_name,
      date: new Date(transaction.date).toISOString()
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert([transactionData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating transaction:', error);
      throw new Error(`Error al crear la transacción: ${error.message}`);
    }

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error('Uncaught error in createTransaction:', error);
    throw error;
  }
}
