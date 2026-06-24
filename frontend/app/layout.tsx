import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { JSX } from "react";

import Providers from "./providers";
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
  title: "Notes App",
  description: "Organize your thoughts with notes and categories.",
};

const RootLayout = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
    <body className="min-h-full flex flex-col">
      <Providers>{children}</Providers>
    </body>
  </html>
);

export default RootLayout;
