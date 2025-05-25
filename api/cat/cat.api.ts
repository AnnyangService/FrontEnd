import api from "@/api/api";
import { ApiResponse } from "@/api/api.types";
import { CatApiData, CatInputData } from "./cat.types";

export const CatAPI = {
    getCatLists: async (): Promise<CatApiData['cats']> => {
        const response = await api.get<ApiResponse<CatApiData['cats']>>('/cats');
        if (!response.data.success) {
            throw new Error(response.data.error.message);
        }
        return response.data.data;
    },
    getCat: async (catId: string): Promise<CatApiData['cat']> => {
        const response = await api.get<ApiResponse<CatApiData['cat']>>(`/cats/${catId}`);
        if (!response.data.success) {
            throw new Error(response.data.error.message);
        }
        return response.data.data;
    },
    registerCat: async (cat: CatInputData['registerCat']): Promise<void> => {
        const response = await api.post<ApiResponse<CatApiData['cat']>>('/cats', cat);
        console.log("🐾 등록 응답 상태:", response.status);
        console.log("🐾 등록 응답 본문:", response.data);
        if (!response.data.success) {
            throw new Error(response.data.error.message);
        }
    },
    updateCat: async (catId: string, cat: CatInputData['registerCat']) => {
        const response = await api.put<ApiResponse<CatApiData['cat']>>(`/cats/${catId}`, cat);
        console.log("✏️ 수정 응답 상태:", response.status);
        console.log("✏️ 수정 응답 본문:", response.data);
        if (!response.data.success) {
            throw new Error(response.data.error.message);
        }
        return response.data.data;
    },
    deleteCat: async (catId: string): Promise<void> => {
        const response = await api.delete<ApiResponse<CatApiData['cat']>>(`/cats/${catId}`);
        console.log("🗑️ 삭제 응답 상태:", response.status);
        console.log("🗑️ 삭제 응답 본문:", response.data);
        if (!response.data.success) {
            throw new Error(response.data.error.message);
        }
    }
};
