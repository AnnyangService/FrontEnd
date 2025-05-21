import api from "@/api/api";
import { ApiResponse } from "@/api/api.types";
import { setAccessToken } from "@/lib/token-memory";
import { AuthApiData } from "./auth.types";

export const AuthAPI = {
    login: async (email: string, password: string): Promise<void> => {
        console.log('Login with:', email, password);
        const response = await api.post<ApiResponse<AuthApiData['login']>>('/auth/login', {
            email,
            password
        });
        if (!response.data.success) {
            throw new Error(response.data.error.message);
        }
        const { accessToken } = response.data.data;
        setAccessToken(accessToken); // Store the token in memory
    },
    signup: async (email: string, password: string, name: string): Promise<void> => {
        const response = await api.post<ApiResponse<AuthApiData['signup']>>('/auth/signup', {
            email,
            password,
            name
        });
        if (!response.data.success) {
            throw new Error(response.data.error.message);
        }
    },
    logout: async (): Promise<void> => {
        const response = await api.post<ApiResponse<AuthApiData['logout']>>('/auth/logout');
        if (!response.data.success) {
            throw new Error(response.data.error.message);
        }
    },
    /**
     * Refresh the access token.
     * @returns {string} accessToken
     */
    refresh: async (): Promise<string> => {
        const response = await api.post<ApiResponse<AuthApiData['login']>>('/auth/refresh');
        if (!response.data.success) {
            throw new Error(response.data.error.message);
        }
        const { accessToken } = response.data.data;
        return accessToken;
    },
    me: async (): Promise<AuthApiData['me']> => {
        const response = await api.get<ApiResponse<AuthApiData['me']>>('/auth/me');
        if (!response.data.success) {
            throw new Error(response.data.error.message);
        }
        return response.data.data;
    }
};  
