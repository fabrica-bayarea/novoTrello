import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

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

export default function RootLayout(
  {  children }: Readonly<{ children: React.ReactNode; }>
) {
  return (
    <html lang="pt-br">
       <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=optional"
        />
         
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Notification />
      </body>
    </html>
  );
}
