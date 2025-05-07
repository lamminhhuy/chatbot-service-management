export function buildPaginatedResponse<T>(data: {
    items: T[];
    total: number;
    limit: number;
    offset: number;
  }) {
    const { items, total, limit, offset } = data;
    const page = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);
  
    return {
      items,
      total,
      limit,
      offset,
      page,
      totalPages,
    };
  }
  