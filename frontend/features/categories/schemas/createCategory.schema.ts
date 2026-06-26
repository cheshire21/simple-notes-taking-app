import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  color: z.string(),
});

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;
