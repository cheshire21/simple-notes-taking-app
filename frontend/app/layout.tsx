import type { Metadata } from "next";
import { Inria_Serif, Inter, Geist } from "next/font/google";
import type { JSX } from "react";

import { cn } from "@/lib/utils";

import Providers from "./providers";

import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
  <html
    lang="en"
    className={cn(
      "h-full",
      "antialiased",
      linter.variable,
      inriaSerif.variable,
      "font-sans",
      geist.variable,
    )}
  >
    <body className="min-h-full flex flex-col">
      <Providers>{children}</Providers>
    </body>
  </html>
);

export default RootLayout;
