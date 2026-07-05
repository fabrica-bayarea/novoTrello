import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";
import { Toaster } from "@/components/ui/sonner";


const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Home",
  description: "A simple Trello",
};

export default function RootLayout(
  {  children }: Readonly<{ children: React.ReactNode; }>
) {
  
  // O nonce do CSP é aplicado automaticamente pelo Next a partir do header setado no proxy.ts
  
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right"/>
      </body>
    </html>
  );
}