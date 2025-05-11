export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
  [key: string]: any; 
}
export function buildPaginatedResponse<T>(data: {
  items: T[];
  meta: PaginationMeta;
}): {
  items: T[];
  meta: PaginationMeta & {
    page: number;
    totalPages: number;
  };
} {
  const { items, meta } = data;

  const limit = meta.limit ?? 10;
  const offset = meta.offset ?? 0;

  const page = Math.floor(offset / limit) + 1;
  const totalPages = limit > 0 ? Math.ceil(meta.total / limit) : 1;

  return {
    items,
    meta: {
      ...meta,
      limit,
      offset,
      page,
      totalPages,
    },
  };
}