import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Limpiar después de cada test
afterEach(() => {
  cleanup();
});

// Mock de next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}));

// Mock de next-auth
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({
    data: { user: { id: 'test-user-id' } },
    status: 'authenticated',
  })),
}));

// Mock de Supabase
vi.mock('@/lib/supabase/client', () => ({
  __esModule: true,
  createClient: vi.fn(() => ({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  })),
}));

// Mock global ResizeObserver para tests de componentes de gráficos
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
