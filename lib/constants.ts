const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  MY_INFO: `${API_BASE_URL}/auth/me`,
} as const;

export const PUBLIC_PATHS = ['/login', '/signup'];
