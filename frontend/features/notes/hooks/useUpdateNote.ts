"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

import { updateNote } from "@/features/notes/api";
import type { Note, UpdateNotePayload } from "@/features/notes/types";

type UpdateNoteVariables = { id: string } & UpdateNotePayload;

const useUpdateNote = (): UseMutationResult<Note, Error, UpdateNoteVariables> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateNoteVariables) => updateNote(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

export default useUpdateNote;
