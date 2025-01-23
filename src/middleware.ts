import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/supabase';

const publicRoutes = ['/auth/login', '/auth/register', '/auth/callback', '/privacy', '/terms'];
const specialRoutes = ['/onboarding'];

export async function middleware(request: NextRequest) {
  try {
    const response = NextResponse.next();

    // Create a Supabase client with cookie handling
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set(name, value, options);
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set(name, '', { ...options, maxAge: 0 });
          },
        },
      }
    );

    const path = request.nextUrl.pathname;
    console.log(`[Middleware] Processing request for path: ${path}`);

    // Fetch authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('[Middleware] User fetch error:', userError);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Handle public routes
    if (publicRoutes.includes(path)) {
      if (user && (path === '/auth/login' || path === '/auth/register')) {
        console.log(`[Middleware] Redirecting from ${path} to /dashboard - Reason: User already authenticated`);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      return response;
    }

    // Redirect unauthenticated users to login
    if (!user) {
      console.log(`[Middleware] Redirecting from ${path} to /auth/login - Reason: No session`);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Allow special routes without profile check
    if (specialRoutes.includes(path)) {
      return response;
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('user_id, organization_id, role')
      .eq('user_id', user?.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('[Middleware] Profile fetch error:', profileError);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Redirect to onboarding if profile is incomplete
    if (!profile?.organization_id && path !== '/onboarding') {
      console.log(`[Middleware] Redirecting from ${path} to /onboarding - Reason: Incomplete profile`);
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    // Allow access to protected routes
    return response;
  } catch (error) {
    console.error('[Middleware] Unexpected error:', error);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
