import type { CreateNotePayload, Note } from "@/features/notes/types";
import api from "@/lib/api";

const listNotes = async (categoryId?: string | null): Promise<Note[]> => {
  const params = categoryId ? { category: categoryId } : {};
  const res = await api.get<Note[]>("/api/notes/", { params });
  return res.data;
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const res = await api.post<Note>("/api/notes/", payload);
  return res.data;
};

export default listNotes;
