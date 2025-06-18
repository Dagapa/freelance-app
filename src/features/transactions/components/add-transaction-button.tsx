'use client';

import { useState } from 'react';
import { Button } from '@shared/ui/button';
import { Plus } from 'lucide-react';
import { AddTransactionModal } from './add-transaction-modal';

export function AddTransactionButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        <span>Agregar transacción</span>
      </Button>
      <AddTransactionModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
