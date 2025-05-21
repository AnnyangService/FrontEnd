export type ApiResponse<T> = {
  success: boolean;
  data: T;
  error: ErrorResponse;
}

export type ErrorResponse = {
  code: string;
  message: string;
}