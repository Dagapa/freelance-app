'use server';

import { createClient } from '@lib/supabase/server';
import { CreateTransactionDTO } from '../types';
import { validateTransactionFields } from '../lib/transactionsUtils';
import { createTransactionInDb } from '../services/transactionsService';

export async function createTransaction(transaction: CreateTransactionDTO) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }
    validateTransactionFields(transaction);
    const created = await createTransactionInDb(user.id, transaction);
    return JSON.parse(JSON.stringify(created));
  } catch (error) {
    console.error('Uncaught error in createTransaction:', error);
    throw error;
  }
}
