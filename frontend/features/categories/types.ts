export interface Category {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface CreateCategoryPayload {
  name: string;
  color?: string;
}
