import { createClient } from '@/lib/supabase/server';

interface CreateCategoryPayload {
  name: string;
}

export async function createCategoryAction(payload: CreateCategoryPayload) {
  const supabase = await createClient();
  const { name } = payload;

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Error getting session in action:', sessionError.message);
      return { error: 'Error al obtener la sesión de usuario', details: sessionError.message, status: 500 };
    }

    if (!session?.user) {
      return { error: 'Usuario no autenticado', status: 401 };
    }

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return { error: 'El nombre de la categoría es requerido y no puede estar vacío.', status: 400 };
    }

    if (name.length > 255) {
      return { error: 'El nombre de la categoría no puede exceder los 255 caracteres.', status: 400 };
    }

    const { data: newCategory, error } = await supabase
      .from('categories')
      .insert({ name: name.trim(), user_id: session.user.id })
      .select()
      .single();

    if (error) {
      console.error('Error creating category in action:', error.message);
      if (error.code === '23505') {
        return { error: 'Ya existe una categoría con este nombre.', details: error.message, status: 409 };
      }
      return { error: 'Error al crear la categoría', details: error.message, status: 500 };
    }

    return { data: newCategory, status: 201 };

  } catch (e: any) {
    console.error('Unexpected error in createCategoryAction:', e.message);
    return { error: 'Error inesperado en el servidor durante la acción', details: e.message, status: 500 };
  }
}
