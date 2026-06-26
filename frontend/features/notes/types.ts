import type { Category } from "@/features/categories/types";

export interface Note {
  id: string;
  title: string;
  content: string;
  category: Category;
  created_at: string;
  updated_at: string;
}
