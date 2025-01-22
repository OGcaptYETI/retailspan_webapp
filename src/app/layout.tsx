// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster as ShadcnToaster } from "./components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import AuthProvider from "./providers";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RetailSpan - Planogram & Pricing Management",
  description: "Retail space management and pricing optimization platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider initialSession={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <ShadcnToaster toasts={[]} />
            <SonnerToaster
              closeButton
              richColors
              theme="system"
              className="toaster-override"
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}