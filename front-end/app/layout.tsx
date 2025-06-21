import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from 'next/headers';

import Notification from "@/components/features/shared/notification";

import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home",
  description: "A simple Trello",
};

export default async function RootLayout(
  {  children }: Readonly<{ children: React.ReactNode; }>
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const nonce = (await headers()).get('x-nonce')
  
  return (
    <html lang="pt-br">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Notification />
      </body>
    </html>
  );
}
