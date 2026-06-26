import type { CreateNotePayload, Note, UpdateNotePayload } from "@/features/notes/types";
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

export const updateNote = async (id: string, payload: UpdateNotePayload): Promise<Note> => {
  const res = await api.patch<Note>(`/api/notes/${id}/`, payload);
  return res.data;
};

export default listNotes;
