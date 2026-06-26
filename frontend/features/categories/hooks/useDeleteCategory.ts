"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

import { deleteCategory } from "@/features/categories/api";

const useDeleteCategory = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export default useDeleteCategory;
