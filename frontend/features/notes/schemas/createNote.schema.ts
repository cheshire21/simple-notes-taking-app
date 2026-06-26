import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  content: z.string(),
  category_id: z.string().min(1, "Category is required"),
});

export type CreateNoteFormValues = z.infer<typeof createNoteSchema>;
