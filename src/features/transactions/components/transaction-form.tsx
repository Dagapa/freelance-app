'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
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
      setDbCategories([]); // Clear categories on error to avoid stale data
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleCategoryCreated = (newCategory: { id: string; name: string }) => {
    fetchCategories(); // Refetch categories to include the new one
    form.setValue('category', newCategory.id, { shouldValidate: true });
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
      category: '',
      date: new Date().toISOString(),
      notes: '',
      ...defaultValues,
    },
  });

  const transactionType = form.watch('type');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de transacción</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="income">Ingreso</SelectItem>
                  <SelectItem value="expense">Gasto</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Pago de cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select
                onValueChange={(value) => {
                  if (value === ADD_NEW_CATEGORY_VALUE) {
                    previousCategoryValueRef.current = field.value; // Store current value
                    setIsAddCategoryModalOpen(true);
                    // Do not call field.onChange here, so the select doesn't briefly show "Add new..."
                  } else {
                    field.onChange(value);
                  }
                }}
                value={field.value} // This ensures the select reflects the form's state
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingCategories ? (
                    <SelectItem value="loading" disabled>Cargando categorías...</SelectItem>
                  ) : (
                    <>
                      {categorySelectOptions.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                      {/* You might want a <SelectSeparator /> here if your UI library supports it */}
                      <SelectItem value={ADD_NEW_CATEGORY_VALUE}>
                        + Agregar nueva categoría
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value).toISOString() : '';
                    field.onChange(date);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Alguna nota adicional..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <AddCategoryModal
          isOpen={isAddCategoryModalOpen}
          onClose={() => {
            setIsAddCategoryModalOpen(false);
            // Restore previous value if user closes modal without adding and select is still on 'add new' or empty
            const currentCategoryValue = form.getValues('category');
            if (previousCategoryValueRef.current && (currentCategoryValue === ADD_NEW_CATEGORY_VALUE || !currentCategoryValue)) {
              form.setValue('category', previousCategoryValueRef.current, { shouldValidate: true });
            }
            previousCategoryValueRef.current = undefined; // Clear the ref
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
    </Form>
  );
}
