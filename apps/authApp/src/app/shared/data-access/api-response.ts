export interface ApiResponse<TData = unknown> {
  success: boolean;
  message?: string;
  data?: TData;
  errors?: string[];
}

export interface ApiListResponse<TData> extends ApiResponse<TData[]> {
  total?: number;
  page?: number;
  pageSize?: number;
}
