"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { JSX } from "react";
import { useState } from "react";

import makeQueryClient from "@/lib/query-client";

const Providers = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [queryClient] = useState(() => makeQueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default Providers;
