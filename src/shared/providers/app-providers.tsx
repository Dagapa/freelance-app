'use client';

import { Toaster } from 'sonner';
import { queryClient } from '@/lib/react-query';
import { ThemeProvider } from './theme-provider';
import { SupabaseProvider } from './supabase-provider';
import { QueryClientProvider } from '@tanstack/react-query';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SupabaseProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster position="top-right" richColors />
        </QueryClientProvider>
      </SupabaseProvider>
    </ThemeProvider>
  );
}
