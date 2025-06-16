'use server';

import { createClient } from '@/lib/supabase/server';
import { CreateTransactionDTO } from '../types';

export async function createTransaction(transaction: CreateTransactionDTO) {
  try {
    console.log('Transaction data received:', JSON.stringify(transaction));
    
    const supabase = await createClient();
    console.log('Supabase client created');
    
    const { data: { user } } = await supabase.auth.getUser();
    console.log('User authentication checked:', user?.id ? 'Authenticated' : 'Not authenticated');
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Ensure all required fields are present and properly formatted
    if (!transaction.description || !transaction.amount || !transaction.type || !transaction.category || !transaction.date) {
      console.error('Missing required fields:', { 
        hasDescription: !!transaction.description,
        hasAmount: !!transaction.amount,
        hasType: !!transaction.type,
        hasCategory: !!transaction.category,
        hasDate: !!transaction.date
      });
      throw new Error('Faltan campos requeridos');
    }

    // Format the transaction data to match the exact database schema
    // Schema: id, user_id, amount, description, type, category, date, created_at, updated_at
    const transactionData = {
      user_id: user.id,
      description: transaction.description,
      amount: typeof transaction.amount === 'string' ? parseFloat(transaction.amount) : transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: new Date(transaction.date).toISOString()
      // created_at and updated_at are handled by default values in the database
    };

    console.log('Prepared transaction data:', JSON.stringify(transactionData));

    const { data, error } = await supabase
      .from('transactions')
      .insert([transactionData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating transaction:', error);
      throw new Error(`Error al crear la transacción: ${error.message}`);
    }

    console.log('Transaction created successfully:', data);
    
    // Convert to plain object to ensure serialization
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error('Uncaught error in createTransaction:', error);
    throw error;
  }
}
