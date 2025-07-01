import { CreateTransactionDTO } from '../types'

export function validateTransactionFields(transaction: CreateTransactionDTO) {
  if (!transaction.description || !transaction.amount || !transaction.type || !transaction.category_id || !transaction.category_name || !transaction.date) {
    throw new Error('Faltan campos requeridos')
  }
} 