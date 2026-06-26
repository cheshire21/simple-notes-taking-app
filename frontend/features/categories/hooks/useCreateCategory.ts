"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";

import createCategory from "@/features/categories/api";
import type { Category, CreateCategoryPayload } from "@/features/categories/types";

export const useCreateCategory = (): UseMutationResult<Category, Error, CreateCategoryPayload> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export default useCreateCategory;
