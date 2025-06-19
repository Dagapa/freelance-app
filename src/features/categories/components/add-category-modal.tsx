'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@shared/ui/input'; // Corrected path based on transaction-form.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated: (newCategory: { id: string; name: string }) => void;
}

export function AddCategoryModal({ isOpen, onClose, onCategoryCreated }: AddCategoryModalProps) {
  const [categoryName, setCategoryName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setError('El nombre de la categoría no puede estar vacío.');
      return;
    }
    setError(null);
    setIsSaving(true);

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categoryName.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Error al crear la categoría');
      }

      onCategoryCreated(result); // result should be the new category object { id, name, ... }
      setCategoryName(''); // Reset for next time
      onClose(); // Close modal on success
    } catch (err: any) {
      console.error('Failed to create category:', err);
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle closing the dialog and resetting state
  const handleClose = () => {
    setCategoryName('');
    setError(null);
    setIsSaving(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Categoría</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category-name" className="text-right">
                Nombre
              </Label>
              <Input
                id="category-name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="col-span-3"
                placeholder="Ej: Comida, Transporte"
              />
            </div>
            {error && <p className="col-span-4 text-sm text-red-500 text-center">{error}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSaving}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
              ) : (
                'Guardar Categoría'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
