"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

import { deleteNote } from "@/features/notes/api";

const useDeleteNote = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

export default useDeleteNote;
