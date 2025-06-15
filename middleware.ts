import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/signup', '/auth/callback', '/api/auth/callback']

type CookieOptions = {
  path?: string
  domain?: string
  maxAge?: number
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'lax' | 'strict' | 'none' | boolean
  expires?: Date
}

export async function middleware(request: NextRequest) {
  // Create a response that will be used to set cookies
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client with cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: Omit<CookieOptions, 'maxAge'>) {
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
          })
        },
      },
    }
  )

  try {
    // Refresh session if expired - required for Server Components
    const { data: { user } } = await supabase.auth.getUser()
    const currentPath = request.nextUrl.pathname

    // If user is not signed in and the current path is not public, redirect to login
    if (!user && !PUBLIC_PATHS.some(path => currentPath.startsWith(path))) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirectedFrom', currentPath)
      return NextResponse.redirect(redirectUrl)
    }

    // If user is signed in and the current path is public, redirect to dashboard
    if (user && PUBLIC_PATHS.some(path => currentPath.startsWith(path) && !currentPath.startsWith('/api'))) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  } catch (error) {
    console.error('Error in middleware:', error)
    // Continue with the response even if there's an error
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth/callback (auth callbacks)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
