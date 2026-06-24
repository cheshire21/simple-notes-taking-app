import { QueryClient } from "@tanstack/react-query";

const makeQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  });

export default makeQueryClient;
