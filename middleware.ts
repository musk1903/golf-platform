import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const protectedRoutes = ['/dashboard', '/book', '/scores']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
        set(name, value, options) { cookieStore.set({ name, value, ...options }) },
        remove(name, options) { cookieStore.delete({ name, ...options }) },
      },
    }
  )
  
  const { data: { user } } = await supabase.auth.getUser()


  if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route)) && !user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/book/:path*',
    '/scores/:path*',
    '/admin/:path*',
  ],
}
