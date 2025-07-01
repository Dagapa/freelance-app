'use client';

import { queryClient } from '@lib/react-query';
import { ThemeProvider } from './theme-provider';
import { SupabaseProvider } from './supabase-provider';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@shared/ui/toast';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SupabaseProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            {children}
          </ToastProvider>
        </QueryClientProvider>
      </SupabaseProvider>
    </ThemeProvider>
  );
}
