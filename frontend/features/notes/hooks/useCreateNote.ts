"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

import { createNote } from "@/features/notes/api";
import type { CreateNotePayload, Note } from "@/features/notes/types";

const useCreateNote = (): UseMutationResult<Note, Error, CreateNotePayload> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

export default useCreateNote;
