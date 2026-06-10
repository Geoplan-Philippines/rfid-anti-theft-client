/** Pagination envelope shared by every list endpoint (`{ data, meta }`). */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/** Common query params for paginated list requests. */
export interface PaginationQuery {
  page: number;
  limit: number;
}
