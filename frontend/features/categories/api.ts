import type { Category, CreateCategoryPayload } from "@/features/categories/types";
import api from "@/lib/api";

export const listCategories = async (): Promise<Category[]> => {
  const res = await api.get<Category[]>("/api/categories/");
  return res.data;
};

const createCategory = async (payload: CreateCategoryPayload): Promise<Category> => {
  const res = await api.post<Category>("/api/categories/", payload);
  return res.data;
};

export default createCategory;
