import type { Category, CreateCategoryPayload } from "@/features/categories/types";
import api from "@/lib/api";

const createCategory = async (payload: CreateCategoryPayload): Promise<Category> => {
  const res = await api.post<Category>("/api/categories/", payload);
  return res.data;
};

export default createCategory;
