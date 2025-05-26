import api from '../api';
import {
  DiagnosisRequestBody,
  DiagnosisResponse,
  DiagnosisStep2Response,
  DiagnosisStep3AttributesResponse,
  DetailedDiagnosisRequestBody,
  DetailedDiagnosisResponse
} from './diagnosis.types';
import { ApiResponse } from '../api.types';

const getStorageKey = (diagnosisId: string) => `step2_polling_${diagnosisId}`;

export const DiagnosisAPI = {
  /**
   * Step 1: 고양이 눈 질병 여부 판단 요청
   * @param imageUrl 진단할 고양이 눈 이미지 URL
   * @returns DiagnosisResponse 질병 여부 판단 결과
   */
  checkDiseaseStatus: async (imageUrl: string): Promise<DiagnosisResponse> => {
    console.log("🐾 질병 여부 판단 요청: 이미지 URL =", imageUrl);
    const storageKey = getStorageKey(imageUrl);
    localStorage.setItem(storageKey, JSON.stringify({ pollingCount: 0 })); // 폴링 횟수 초기화
    const requestBody: DiagnosisRequestBody = { imageUrl: imageUrl };
    const response = await api.post<ApiResponse<DiagnosisResponse>>('/diagnosis/step1', requestBody);
    console.log("🐾 등록 응답 상태:", response.status);
    console.log("🐾 등록 응답 본문:", response.data);
    if (!response.data.success) {
        throw new Error(response.data.error.message);
    }
    return response.data.data;
  },

  /**
   * Step 2: 질병 대분류 판단 결과 조회
   * @param diagnosisId Step 1에서 반환된 진단 ID
   * @returns DiagnosisStep2Response 질병 대분류 판단 결과
   */
  getDiseaseCategory: async (diagnosisId: string): Promise<DiagnosisStep2Response | null> => {
    // 실제 API 호출 대신 모의 데이터 반환
    console.log(`🐾 질병 대분류 조회 요청: ID=${diagnosisId}`);
    
    // 폴링 테스트를 위한 모킹 구현
    // 로컬 스토리지에 폴링 시도 횟수 저장 (테스트용)
    const storageKey = getStorageKey(diagnosisId);
    const storedPollingCount = localStorage.getItem(storageKey);
    const pollingCount = storedPollingCount
      ? parseInt(storedPollingCount || '0')
      : 0;
    
    // 폴링 횟수 증가
    localStorage.setItem(storageKey, (pollingCount + 1).toString());

    // 테스트를 위해 처음 3번은 결과가 아직 준비되지 않은 것처럼 처리
    if (pollingCount < 3) {
      console.log(`🕒 질병 대분류 아직 처리중... (시도 #${pollingCount + 1})`);
      return null; // 결과가 아직 준비되지 않음
    }
    
    // 모킹 데이터 (폴링 성공)
    const mockResponse: DiagnosisStep2Response = {
      id: diagnosisId,
      category: "결막염 의심", // 예시 카테고리
      confidence: 0.85
    };
    
    // 실제 구현 시 아래 주석 해제 및 모킹 코드 제거
    /*
    try {
      const response = await api.get<ApiResponse<DiagnosisStep2Response>>(`/diagnosis/step2/${diagnosisId}`);
      
      // 분석이 아직 진행중인 경우 - 서버 응답 형태에 맞게 수정 필요
      if (response.data.status === 'processing' || !response.data.data) {
        return null;
      }
      
      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }
      
      return response.data.data;
    } catch (error) {
      console.error("질병 대분류 조회 중 오류:", error);
      throw error;
    }
    */
    
    return mockResponse;
  },

  /**
   * Step 3: 세부 질병 진단에 필요한 속성(질문) 목록 조회
   * @param diagnosisId Step 1에서 반환된 진단 ID
   * @returns DiagnosisStep3AttributesResponse 세부 질병 진단 속성 목록
   */
  getDiagnosisAttributes: async (diagnosisId: string): Promise<DiagnosisStep3AttributesResponse> => {
    // 실제 API 호출 대신 모의 데이터 반환
    console.log(`🐾 질병 세부 속성 조회 요청: ID=${diagnosisId}`);
    
    // 모킹 데이터
    const mockResponse: DiagnosisStep3AttributesResponse = {
      attributes: [
        { id: 1, description: "눈물이 과도하게 나오나요?" },
        { id: 2, description: "눈 주변에 분비물이 있나요?" },
        { id: 3, description: "눈을 자주 비비거나 가려워하나요?" },
        { id: 4, description: "눈 주변 털이 젖어있거나 엉겨있나요?" }
      ]
    };
    
    // 실제 구현 시 아래 주석 해제 및 모킹 코드 제거
    /*
    const response = await api.get<ApiResponse<DiagnosisStep3AttributesResponse>>(`/diagnosis/attributes/${diagnosisId}`);
    if (!response.data.success) {
      throw new Error(response.data.error.message);
    }
    return response.data.data;
    */
    
    return mockResponse;
  },

  /**
   * Step 4: 세부 질병 진단 결과 요청
   * @param requestData 진단 ID와 선택된 속성(질문) 목록
   * @returns DetailedDiagnosisResponse 세부 질병 진단 결과
   */
  submitDetailedDiagnosis: async (requestData: DetailedDiagnosisRequestBody): Promise<DetailedDiagnosisResponse> => {
    // 실제 API 호출 대신 모의 데이터 반환
    console.log("🐾 세부 질병 진단 요청:", requestData);
    
    // 모킹 데이터
    const mockResponse: DetailedDiagnosisResponse = {
      diagnosis_id: requestData.diagnosis_id,
      category: "세균성 결막염", // 예시 세부 질병명
      confidence: 0.92
    };
    
    // 실제 구현 시 아래 주석 해제 및 모킹 코드 제거
    /*
    const response = await api.post<ApiResponse<DetailedDiagnosisResponse>>('/diagnosis/detailed', requestData);
    if (!response.data.success) {
      throw new Error(response.data.error.message);
    }
    return response.data.data;
    */
    
    return mockResponse;
  }
};
