import type { Metadata } from "next";
import { Inria_Serif, Inter } from "next/font/google";
import type { JSX } from "react";

import Providers from "./providers";
import "./globals.css";

const linter = Inter({
  variable: "--font-linter-base",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inriaSerif = Inria_Serif({
  variable: "--font-inria-serif-base",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Notes App",
  description: "Organize your thoughts with notes and categories.",
};

const RootLayout = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <html lang="en" className={`${linter.variable} ${inriaSerif.variable} h-full antialiased`}>
    <body className="min-h-full flex flex-col">
      <Providers>{children}</Providers>
    </body>
  </html>
);

export default RootLayout;
