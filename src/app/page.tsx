import { redirect } from "next/navigation";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/types/supabase";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createPagesServerClient<Database>({ cookies: cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/auth/login");
  }
}
