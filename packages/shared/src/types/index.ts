// TODO: tipos compartilhados que não cabem em constants/ ou schemas/.
// Ex: tipos derivados de Drizzle (`InferSelectModel<typeof tables.persons>`),
// tipos de paginação, response wrappers, etc.

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type ApiError = {
  error: string;
  message?: string;
  details?: unknown;
};
