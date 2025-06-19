import { createClient } from '@/lib/supabase/server';

export async function getCategoriesAction() {
  const supabase = await createClient();

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Error getting session in action:', sessionError.message);
      return { error: 'Error al obtener la sesión de usuario', details: sessionError.message, status: 500 };
    }

    if (!session?.user) {
      return { error: 'Usuario no autenticado', status: 401 };
    }

    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching categories in action:', error.message);
      return { error: 'Error al obtener las categorías', details: error.message, status: 500 };
    }

    return { data: categories, status: 200 };

  } catch (e: any) {
    console.error('Unexpected error in getCategoriesAction:', e.message);
    return { error: 'Error inesperado en el servidor', details: e.message, status: 500 };
  }
}
