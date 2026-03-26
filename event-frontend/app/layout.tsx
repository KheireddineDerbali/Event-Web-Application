import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "EventPlatform",
  description: "Plateforme de gestion d'événements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen bg-background font-sans antialiased flex flex-col`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
