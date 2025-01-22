// src/middleware.ts

import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/types/supabase"

export async function middleware(request: NextRequest) {
  // NextResponse allows us to pass cookies set by the Supabase client
  const response = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req: request, res: response })

  // Example: get session data
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Possibly do something with `session` if needed
  return response
}

export const config = {
  matcher: ["/dashboard/:path*", "/some-protected-route"], 
}
