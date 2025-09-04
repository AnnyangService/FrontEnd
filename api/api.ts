import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, setAccessToken, clearAccessToken } from '../lib/token-memory';
import { ApiResponse } from './api.types';
import { API_BASE_URL } from './api.constants';
import { AuthAPI } from './auth/auth.api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL, // API 기본 URL 설정
  withCredentials: true, // CORS 요청에 쿠키 포함
  headers: {
    'Content-Type': 'application/json', // 요청 헤더 설정
  }
});

// 요청 인터셉터: 모든 요청에 인증 토큰을 추가
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  console.log('🚀 Local App Request:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data,
  });
  
  return config;
});

// 토큰 재시도 로직을 위한 커스텀 설정 인터페이스
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean; // 재시도 여부를 추적하는 플래그
}

// 토큰 새로고침 상태를 추적하는 플래그
let isRefreshing = false;

// 토큰 새로고침 대기 중인 요청들의 콜백 배열
let subscribers: ((token: string) => void)[] = [];

// 토큰이 새로고침된 후 대기 중인 요청들을 처리하는 함수
function onRefreshed(token: string): void {
  subscribers.forEach(cb => cb(token));
  subscribers = []; // 콜백 목록 초기화
}

// 토큰 새로고침을 기다리는 요청을 등록하는 함수
function subscribeTokenRefresh(cb: (token: string) => void): void {
  subscribers.push(cb);
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError): Promise<AxiosResponse | void> => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;
    
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          const newAccessToken = await AuthAPI.refresh();
          
          if (!newAccessToken) {
            throw new Error('Failed to refresh token');
          }
          
          setAccessToken(newAccessToken);
          onRefreshed(newAccessToken);
          
          // 원래 요청 재시도
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          }
          return api(originalRequest);
          
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          subscribers = [];
          // 토큰 갱신 실패 시에도 바로 로그인 페이지로 이동하지 않음
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // 현재 요청을 대기열에 추가
      return new Promise(resolve => {
        subscribeTokenRefresh(token => {
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
          }
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;