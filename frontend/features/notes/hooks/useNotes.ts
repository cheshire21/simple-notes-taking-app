"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import listNotes from "@/features/notes/api";
import type { Note } from "@/features/notes/types";

const useNotes = (categoryId?: string | null): UseQueryResult<Note[]> =>
  useQuery({
    queryKey: ["notes", categoryId ?? null],
    queryFn: async () => listNotes(categoryId),
  });

export default useNotes;
