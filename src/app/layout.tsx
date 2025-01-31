import "@/app/globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { ThemeProvider } from "@/app/theme-provider";

export const metadata = {
  title: "Retail Span",
  description: "Empowering retailers with tools for planograms, pricing, and product management.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-900 text-gray-100">
        {/* Wrap the app with AuthProvider and ThemeProvider */}
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

