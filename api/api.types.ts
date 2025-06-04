export type ApiResponse<T> = {
  status: string;
  success: boolean;
  data: T;
  error: ErrorResponse;
}

export type ErrorResponse = {
  code: string;
  message: string;
}