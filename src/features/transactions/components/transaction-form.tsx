'use client';

import { Input } from '@shared/ui/input';
import { useForm } from 'react-hook-form';
import { Button } from '@shared/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/ui/form';
import { Select } from '@shared/ui/select';
import { Textarea } from '@shared/ui/textarea';
import { transactionFormSchema, TransactionFormValues } from '../lib/schema';
import { Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { AddCategoryModal } from '../../categories/components/add-category-modal';

interface TransactionFormProps {
  onSubmit: (values: TransactionFormValues) => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<TransactionFormValues>;
}

export function TransactionForm({
  onSubmit,
  isSubmitting = false,
  defaultValues = {
    type: 'expense',
    date: new Date().toISOString(),
  },
}: TransactionFormProps) {
  const [dbCategories, setDbCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const previousCategoryValueRef = useRef<string | undefined>(undefined);
  const ADD_NEW_CATEGORY_VALUE = '__ADD_NEW_CATEGORY__';

  useEffect(() => {
    async function fetchCategories() {
      setIsLoadingCategories(true);
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          console.error('Failed to fetch categories, status:', response.status);
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          console.error('Fetched categories data is not an array:', data);
          setDbCategories([]);
        } else {
          setDbCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setDbCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        console.error('Failed to fetch categories, status:', response.status);
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error('Fetched categories data is not an array:', data);
        setDbCategories([]);
      } else {
        setDbCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setDbCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleCategoryCreated = (newCategory: { id: string; name: string }) => {
    fetchCategories();
    form.setValue('category_id', newCategory.id, { shouldValidate: true });
    form.setValue('category_name', newCategory.name, { shouldValidate: true }); // Keep this as newCategory.name is directly available
    setIsAddCategoryModalOpen(false);
  };

  const categorySelectOptions = dbCategories.map(cat => ({
    value: cat.id,
    label: cat.name,
  }));

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      description: '',
      amount: 0,
      type: 'expense',
      category_name: '',
      category_id: '',
      date: new Date().toISOString(),
      notes: '',
      ...defaultValues,
    },
  });

  console.log(categorySelectOptions);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <FormLabel>Tipo de transacción</FormLabel>
        <Select 
          value={form.watch('type')} 
          onValueChange={(value) => form.setValue('type', value as 'income' | 'expense')}
          options={[
            { value: 'income', label: 'Ingreso' },
            { value: 'expense', label: 'Gasto' }
          ]}
          placeholder="Selecciona un tipo"
        />
        {form.formState.errors.type && (
          <FormMessage>{form.formState.errors.type.message}</FormMessage>
        )}
      </div>

      <div className="space-y-2">
        <FormLabel>Descripción</FormLabel>
        <Input 
          placeholder="Ej: Pago de cliente" 
          {...form.register('description')}
        />
        {form.formState.errors.description && (
          <FormMessage>{form.formState.errors.description.message}</FormMessage>
        )}
      </div>

      <div className="space-y-2">
        <FormLabel>Monto</FormLabel>
        <Input
          type="number"
          step="0.01"
          placeholder="0.00"
          {...form.register('amount', { valueAsNumber: true })}
        />
        {form.formState.errors.amount && (
          <FormMessage>{form.formState.errors.amount.message}</FormMessage>
        )}
      </div>

      <div className="space-y-2">
        <FormLabel>Categoría</FormLabel>
        <Select
          value={form.watch('category_id')}
          onValueChange={(value) => {
            if (value === ADD_NEW_CATEGORY_VALUE) {
              previousCategoryValueRef.current = form.getValues('category_id');
              setIsAddCategoryModalOpen(true);
            } else {
              form.setValue('category_id', value);
              const selectedCategoryObject = dbCategories.find(cat => cat.id === value);
              if (selectedCategoryObject) {
                form.setValue('category_name', selectedCategoryObject.name);
              }
            }
          }}
          options={[
            ...categorySelectOptions,
            { value: ADD_NEW_CATEGORY_VALUE, label: '+ Agregar nueva categoría' }
          ]}
          placeholder="Selecciona una categoría"
          disabled={isLoadingCategories}
        />
        {form.formState.errors.category_id && (
          <FormMessage>{form.formState.errors.category_id.message}</FormMessage>
        )}
      </div>

      <div className="space-y-2">
        <FormLabel>Fecha</FormLabel>
        <Input
          type="datetime-local"
          value={form.watch('date') ? new Date(form.watch('date')).toISOString().slice(0, 16) : ''}
          onChange={(e) => {
            const date = e.target.value ? new Date(e.target.value).toISOString() : '';
            form.setValue('date', date);
          }}
        />
        {form.formState.errors.date && (
          <FormMessage>{form.formState.errors.date.message}</FormMessage>
        )}
      </div>

      <div className="space-y-2">
        <FormLabel>Notas (opcional)</FormLabel>
        <Textarea
          placeholder="Alguna nota adicional..."
          className="resize-none"
          {...form.register('notes')}
        />
        {form.formState.errors.notes && (
          <FormMessage>{form.formState.errors.notes.message}</FormMessage>
        )}
      </div>

        <AddCategoryModal
          isOpen={isAddCategoryModalOpen}
          onClose={() => {
            setIsAddCategoryModalOpen(false);
            const currentCategoryId = form.getValues('category_id');
            // If modal is closed and category_id is still 'add new' or empty, restore previous selection
            if (previousCategoryValueRef.current && (currentCategoryId === ADD_NEW_CATEGORY_VALUE || !currentCategoryId)) {
              const previousSelectedCategory = dbCategories.find(cat => cat.id === previousCategoryValueRef.current);
              form.setValue('category_id', previousCategoryValueRef.current, { shouldValidate: true });
              if (previousSelectedCategory) {
                form.setValue('category_name', previousSelectedCategory.name, { shouldValidate: true });
              }
            }
            previousCategoryValueRef.current = undefined;
          }}
          onCategoryCreated={handleCategoryCreated}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar transacción'
          )}
        </Button>
      </form>
  );
}
