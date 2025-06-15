'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useModal } from '@/contexts/modal-context';
import { ErrorModal } from '@/components/modals/error-modal';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showModal } = useModal();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.user) {
        // Esperar a que la sesión se establezca
        await supabase.auth.getSession();
        router.refresh();
        router.push('/dashboard');
      } else {
        throw new Error('No se pudo obtener la información del usuario');
      }
    } catch (error: any) {
      console.error('Error:', error);
      
      let errorMessage = 'Error al iniciar sesión. Por favor, intenta de nuevo.';
      let errorTitle = 'Error de autenticación';

      if (error.message === 'Invalid login credentials') {
        errorMessage = 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.';
      } else if (error.message === 'Email not confirmed') {
        errorMessage = 'Tu correo electrónico no ha sido confirmado. Por favor, revisa tu bandeja de entrada y sigue el enlace de confirmación.';
        errorTitle = 'Email no confirmado';
      }

      showModal(
        <ErrorModal
          message={errorMessage}
          onClose={() => showModal(null, '')}
        />,
        errorTitle
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm">
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
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </Button>
    </form>
  );
} 