const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  MY_INFO: `${API_BASE_URL}/auth/me`,
  GET_CAT_LIST: `${API_BASE_URL}/cats`,
  REGISTER_CAT: `${API_BASE_URL}/cats`,
  GET_CAT: (id: string) => `${API_BASE_URL}/cats/${id}`,
} as const;

export const PUBLIC_PATHS = ['/login', '/sign_up'];
