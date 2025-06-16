'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { ThemeProvider } from './theme-provider';
import { SupabaseProvider } from './supabase-provider';
import { Toaster } from 'sonner';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SupabaseProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster position="top-center" richColors />
        </QueryClientProvider>
      </SupabaseProvider>
    </ThemeProvider>
  );
}
