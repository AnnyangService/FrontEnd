export type ApiResponse<T> = {
  success: boolean;
  data: T;
  error: ErrorResponse;
}

export type ErrorResponse = {
  code: string;
  message: string;
}


export async function fetchApi<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
  });

  const body: ApiResponse<T> = await response.json();

  if (!response.ok || !body.success) {
    throw new Error(body.error.message);
  }

  return body;
}