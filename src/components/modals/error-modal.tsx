'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

export function ErrorModal({ message, onClose }: ErrorModalProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
        <AlertCircle className="h-6 w-6" />
        <h3 className="text-lg font-medium">Error</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-300">{message}</p>
      <div className="flex justify-end">
        <Button onClick={onClose}>Cerrar</Button>
      </div>
    </div>
  );
} 