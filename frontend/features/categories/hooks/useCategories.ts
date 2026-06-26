"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { listCategories } from "@/features/categories/api";
import type { Category } from "@/features/categories/types";

const useCategories = (): UseQueryResult<Category[]> =>
  useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  });

export default useCategories;
