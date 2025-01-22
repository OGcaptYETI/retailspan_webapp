import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/supabase';

// Helper function to log redirects
function logRedirect(from: string, to: string, reason: string) {
  console.log(`[Middleware] Redirecting from ${from} to ${to} - Reason: ${reason}`);
}

// Define routes that don't require authentication
const publicRoutes = ['/auth/login', '/auth/register', '/auth/callback', '/privacy', '/terms'];

// Define routes that allow incomplete profiles
const specialRoutes = ['/onboarding'];

export async function middleware(request: NextRequest) {
  try {
    // Create a response object
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
            // If the cookie is updated, update the request and response
            request.cookies.set({
              name,
              value,
              ...options,
            });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            // If the cookie is removed, update the request and response
            request.cookies.set({
              name,
              value: '',
              ...options,
            });
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    const path = request.nextUrl.pathname;
    console.log(`[Middleware] Processing request for path: ${path}`);

    // Get session
    const { data: { session } } = await supabase.auth.getSession();

    // Handle public routes
    if (publicRoutes.includes(path)) {
      if (session && (path === "/auth/login" || path === "/auth/register")) {
        logRedirect(path, "/dashboard", "User already authenticated");
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return response;
    }

    // Redirect unauthenticated users to login
    if (!session) {
      logRedirect(path, "/auth/login", "No session");
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Allow special routes without profile check
    if (specialRoutes.includes(path)) {
      return response;
    }

    // Check user profile
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("user_id, organization_id, role")
      .eq("user_id", session.user.id)
      .single();

    if (profileError && profileError.code === "PGRST116") {
      console.log(`[Middleware] No profile found for user ID: ${session.user.id}`);
    } else if (profileError) {
      console.error("[Middleware] Profile fetch error:", profileError);
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Redirect to onboarding if profile is incomplete
    if (!profile?.organization_id && path !== "/onboarding") {
      logRedirect(path, "/onboarding", "Incomplete profile");
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    // Allow access to protected routes
    return response;
  } catch (error) {
    console.error("[Middleware] Unexpected error:", error);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

// Configure which routes use this middleware
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|assets|api).*)"],
};