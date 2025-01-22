// /lib/supabase/server-client.ts

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { type Database } from '@/types/supabase';

export const createServerSupabaseClient = () => {
  return createServerComponentClient<Database>({ cookies });
};

// For createPagesServerClient
import { createPagesServerClient as createSupabasePagesServerClient } from '@supabase/auth-helpers-nextjs';

import { NextApiRequest, NextApiResponse } from 'next';

export const createPagesServerClient = (context: { req: NextApiRequest, res: NextApiResponse }) => {
  return createSupabasePagesServerClient<Database>({ req: context.req, res: context.res });
};
