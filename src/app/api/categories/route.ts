import { createClient } from '../../../lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('Error getting session:', sessionError.message)
      return NextResponse.json({ error: 'Error al obtener la sesión de usuario', details: sessionError.message }, { status: 500 })
    }

    if (!session?.user) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 })
    }

    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error.message)
      return NextResponse.json({ error: 'Error al obtener las categorías', details: error.message }, { status: 500 })
    }

    return NextResponse.json(categories)

  } catch (e: any) {
    console.error('Unexpected error in GET /api/categories:', e.message)
    return NextResponse.json({ error: 'Error inesperado en el servidor', details: e.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = await createClient()

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('Error getting session:', sessionError.message)
      return NextResponse.json({ error: 'Error al obtener la sesión de usuario', details: sessionError.message }, { status: 500 })
    }

    if (!session?.user) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 })
    }

    const { name } = await request.json()

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'El nombre de la categoría es requerido y no puede estar vacío.' }, { status: 400 })
    }
    
    if (name.length > 255) {
      return NextResponse.json({ error: 'El nombre de la categoría no puede exceder los 255 caracteres.' }, { status: 400 })
    }

    const { data: newCategory, error } = await supabase
      .from('categories')
      .insert({ name: name.trim(), user_id: session.user.id })
      .select()
      .single() // Asegura que devuelva el objeto insertado

    if (error) {
      console.error('Error creating category:', error.message)
      // Podría ser un error de unicidad si tienes esa restricción, o RLS.
      if (error.code === '23505') { // unique_violation
        return NextResponse.json({ error: 'Ya existe una categoría con este nombre.', details: error.message }, { status: 409 });
      }
      return NextResponse.json({ error: 'Error al crear la categoría', details: error.message }, { status: 500 })
    }

    return NextResponse.json(newCategory, { status: 201 })

  } catch (e: any) {
    console.error('Unexpected error in POST /api/categories:', e.message)
    if (e instanceof SyntaxError) { // Error al parsear JSON
        return NextResponse.json({ error: 'Cuerpo de la solicitud mal formado.', details: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error inesperado en el servidor', details: e.message }, { status: 500 })
  }
}
