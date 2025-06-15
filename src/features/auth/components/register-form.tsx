'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useModal } from '@/contexts/modal-context';
import { ErrorModal } from '@/components/modals/error-modal';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showModal } = useModal();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showModal(
        <ErrorModal
          message="Las contraseñas no coinciden"
          onClose={() => showModal(null, '')}
        />,
        'Error de validación'
      );
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // Mostrar mensaje de éxito y redirigir al login
      showModal(
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
            <h3 className="text-lg font-medium">¡Registro exitoso!</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Por favor, verifica tu correo electrónico para continuar.
          </p>
          <div className="flex justify-end">
            <Button onClick={() => router.push('/login')}>Ir al login</Button>
          </div>
        </div>,
        'Registro completado'
      );
    } catch (error) {
      console.error('Error:', error);
      showModal(
        <ErrorModal
          message="Error al registrar usuario. Por favor, intenta de nuevo."
          onClose={() => showModal(null, '')}
        />,
        'Error de registro'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4 w-full max-w-sm">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
          minLength={6}
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
          Confirmar contraseña
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
          minLength={6}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrarse'}
      </Button>
    </form>
  );
} 