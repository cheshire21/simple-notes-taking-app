export interface ApiError {
  detail?: string;
  [field: string]: string | string[] | undefined;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: Category | null;
  created_at: string;
  updated_at: string;
}
