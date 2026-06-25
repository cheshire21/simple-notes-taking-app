"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { JSX } from "react";
import { useState } from "react";

import AuthProvider from "@/features/auth/context/AuthContext";
import makeQueryClient from "@/lib/query-client";

const Providers = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [queryClient] = useState(() => makeQueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};

export default Providers;
