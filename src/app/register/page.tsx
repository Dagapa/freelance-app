'use client';

import { RegisterForm } from '@/features/auth/components/register-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Crea tu cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            O{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary/90"
            >
              inicia sesión si ya tienes una cuenta
            </Link>
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
} 