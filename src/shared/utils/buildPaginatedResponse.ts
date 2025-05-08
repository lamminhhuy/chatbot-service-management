export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
  [key: string]: any; 
}
export function buildPaginatedResponse<T>(data: {
    items: T[];
    meta: PaginationMeta 
  }): {
    items: T[];
    meta: PaginationMeta &{
        page: number;
        totalPages: number;
    }
  } {
    const { items, meta } = data;
    const page = Math.floor(meta.offset / meta.limit) + 1;
    const totalPages = Math.ceil(meta.total / meta.limit);
  
    return {
      items,
      meta:{
        ...meta,
        page,
        totalPages,
      },
    };
  }
  