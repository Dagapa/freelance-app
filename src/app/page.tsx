'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    };

    checkUser();
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Bienvenido a Freelance Finance
        </h1>
        <p className="text-center mb-8">
          Tu herramienta de gestión financiera para freelancers colombianos
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.push('/login')}>Iniciar Sesión</Button>
          <Button variant="outline" onClick={() => router.push('/register')}>
            Registrarse
          </Button>
        </div>
      </div>
    </main>
  );
}
