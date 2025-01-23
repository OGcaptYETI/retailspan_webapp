// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster as ShadcnToaster } from "./components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import AuthProvider from "./providers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

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
  const supabase = createServerComponentClient({ cookies });

  // Fix: Fetch session securely
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Supabase session fetch error:", error.message);
  }

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
