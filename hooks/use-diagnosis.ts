import { useState, useCallback } from 'react';
import { API_ENDPOINTS } from '@/lib/constants';

/*
****질병 진단 API 호출을 위한 훅****
step1 -> 질병 여부 판단
step2 -> 질병 대분류
step3 -> 세부질병 판별 위한 질문 목록
step4 -> 세부질병 질문에 대한 결과값

*/


//step1
//질병 이미지 인터페이스
interface DiagnosisRequestBody {
  image_url: string;
}

//질병 여부 판단 인터페이스
export interface DiagnosisResponse { 
  id: string; // ULID
  is_normal: boolean;
  confidence: number;
}

//step2
//질병대분류 인터페이스
export interface DiagnosisStep2Response {
  id: string; 
  category: string;
  confidence: number;
}

//step3
//질병세부분류 질병 대한 인터페이스
export interface DiagnosisAttribute {
  id: number;
  description: string;
}
export interface DiagnosisStep3AttributesResponse {
  attributes: DiagnosisAttribute[];
}

//step4
//질문 하나 대한 답변
export interface SubmittedAttribute { // ✅ export 키워드 추가
  id: number;
  description: string; 
}

//리스트화
interface DetailedDiagnosisRequestBody {
  diagnosis_id: string;
  attributes: SubmittedAttribute[];
}

//세부질병대한 답변 인터페이스
export interface DetailedDiagnosisResponse {
  diagnosis_id: string;
  category: string; // 예: "keratitis" - 세부 질병명
  confidence: number;
}

export function useDiagnosis() {
  const [loadingStep1, setLoadingStep1] = useState(false);
  const [errorStep1, setErrorStep1] = useState<string | null>(null);
  const [step1Result, setStep1Result] = useState<DiagnosisResponse | null>(null);

  const [loadingStep2, setLoadingStep2] = useState(false);
  const [errorStep2, setErrorStep2] = useState<string | null>(null);
  const [step2Result, setStep2Result] = useState<DiagnosisStep2Response | null>(null);

  const [loadingAttributes, setLoadingAttributes] = useState(false);
  const [errorAttributes, setErrorAttributes] = useState<string | null>(null);
  const [attributesResult, setAttributesResult] = useState<DiagnosisStep3AttributesResponse | null>(null);

  const [loadingDetailedDiagnosis, setLoadingDetailedDiagnosis] = useState(false);
  const [errorDetailedDiagnosis, setErrorDetailedDiagnosis] = useState<string | null>(null);
  const [detailedDiagnosisResult, setDetailedDiagnosisResult] = useState<DetailedDiagnosisResponse | null>(null);

  // 1-1. 질병 여부 판단 요청 API 호출(POST)
  const checkDiseaseStatus = useCallback(async (imageUrl: string): Promise<DiagnosisResponse | null> => { // ✅ 반환 타입 명시
    setLoadingStep1(true);
    setErrorStep1(null);
    setStep1Result(null); 

    if (!imageUrl) {
      setErrorStep1("이미지 URL이 존재하지 않습니다.");
      setLoadingStep1(false);
      return null;
    }

    try {
      const requestBody: DiagnosisRequestBody = { image_url: imageUrl };

      const response = await fetch(API_ENDPOINTS.DIS_MODEL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data: DiagnosisResponse | { message?: string; error?: { message?: string } } = await response.json();

      if (!response.ok) {
        const errorMessage = (data as any)?.message || (data as any)?.error?.message || '질병 여부 판단 요청에 실패했습니다.';
        throw new Error(errorMessage);
      }

      setStep1Result(data as DiagnosisResponse);
      return data as DiagnosisResponse;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '질병 여부 판단 중 에러가 발생했습니다.';
      setErrorStep1(errorMessage);
      console.error("Error checking disease status:", err);
      return null;
    } finally {
      setLoadingStep1(false);
    }
  }, []);


  // 1-2. 질병 대분류 판단 요청 API 호출(GET))
  const getDiseaseCategory = useCallback(async (diagnosisId: string): Promise<DiagnosisStep2Response | null> => {
    setLoadingStep2(true);
    setErrorStep2(null);
    setStep2Result(null);

    // diagnosisId 타입 가드 (이미 string으로 받고 있지만, 방어적으로)
    if (typeof diagnosisId !== 'string' || !diagnosisId) {
      setErrorStep2("진단 ID가 유효하지 않습니다.");
      setLoadingStep2(false);
      return null;
    }

    try {
      const response = await fetch(API_ENDPOINTS.DIS_CATEGORY(diagnosisId), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: DiagnosisStep2Response | { message?: string; error?: { message?: string } } = await response.json();

      if (!response.ok) {
        const errorMessage = (data as any)?.message || (data as any)?.error?.message || '질병 대분류 판단 결과 조회에 실패했습니다.';
        throw new Error(errorMessage);
      }

      setStep2Result(data as DiagnosisStep2Response);
      return data as DiagnosisStep2Response;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '질병 대분류 판단 결과 조회 중 에러가 발생했습니다.';
      setErrorStep2(errorMessage);
      console.error("Error getting disease category (Step 2):", err);
      return null;
    } finally {
      setLoadingStep2(false);
    }
  }, []);

   // 1-3. 세부 질병 진단에 필요한 attribute 목록 (GET)
  const getDiagnosisAttributes = useCallback(async (diagnosisId: string): Promise<DiagnosisStep3AttributesResponse | null> => {
    setLoadingAttributes(true);
    setErrorAttributes(null);
    setAttributesResult(null);

    if (typeof diagnosisId !== 'string' || !diagnosisId) { 
      setErrorAttributes("진단 ID가 유효하지 않습니다.");
      setLoadingAttributes(false);
      return null;
    }

    try {
      if (typeof API_ENDPOINTS.DIS_ATTRIBUTES !== 'function') {
          console.error("API_ENDPOINTS.DIS_ATTRIBUTES가 함수 형태로 정의되지 않았거나 존재하지 않습니다. lib/constants.ts 파일을 확인해주세요.");
          setErrorAttributes("API 엔드포인트 설정 오류입니다.");
          setLoadingAttributes(false);
          return null;
      }

      const response = await fetch(API_ENDPOINTS.DIS_ATTRIBUTES(diagnosisId), { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: DiagnosisStep3AttributesResponse | { message?: string; error?: { message?: string } } = await response.json();

      if (!response.ok) {
        const errorMessage = (data as any)?.message || (data as any)?.error?.message || '세부 진단 속성 목록 조회에 실패했습니다.';
        throw new Error(errorMessage);
      }

      setAttributesResult(data as DiagnosisStep3AttributesResponse);
      return data as DiagnosisStep3AttributesResponse;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '세부 진단 속성 목록 조회 중 에러가 발생했습니다.';
      setErrorAttributes(errorMessage);
      console.error("Error getting diagnosis attributes (Step 3):", err);
      return null;
    } finally {
      setLoadingAttributes(false);
    }
  }, []);


  // 1-4. 세부 질병 진단 결과 조회 (POST)
  const submitDetailedDiagnosis = useCallback(async (
    requestData: DetailedDiagnosisRequestBody 
  ): Promise<DetailedDiagnosisResponse | null> => {
    setLoadingDetailedDiagnosis(true);
    setErrorDetailedDiagnosis(null);
    setDetailedDiagnosisResult(null);

    // DetailedDiagnosisRequestBody 에서 diagnosis_id는 string으로 정의되어 있음
    if (!requestData.diagnosis_id || !requestData.attributes || requestData.attributes.length === 0) {
      setErrorDetailedDiagnosis("진단 ID와 선택된 속성 값들이 필요합니다.");
      setLoadingDetailedDiagnosis(false);
      return null;
    }

    try {
  
      if (!API_ENDPOINTS.DIS_DETAILED) { 
          console.error("API_ENDPOINTS.DIS_DETAILED 가 정의되지 않았습니다. lib/constants.ts 파일을 확인해주세요.");
          setErrorDetailedDiagnosis("API 엔드포인트 설정 오류입니다.");
          setLoadingDetailedDiagnosis(false);
          return null;
      }

      const response = await fetch(API_ENDPOINTS.DIS_DETAILED, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data: DetailedDiagnosisResponse | { message?: string; error?: { message?: string } } = await response.json();

      if (!response.ok) {
        const errorMessage = (data as any)?.message || (data as any)?.error?.message || '세부 질병 진단 요청에 실패했습니다.';
        throw new Error(errorMessage);
      }

      setDetailedDiagnosisResult(data as DetailedDiagnosisResponse);
      return data as DetailedDiagnosisResponse;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '세부 질병 진단 요청 중 에러가 발생했습니다.';
      setErrorDetailedDiagnosis(errorMessage);
      console.error("Error submitting detailed diagnosis (Step 4):", err);
      return null;
    } finally {
      setLoadingDetailedDiagnosis(false);
    }
  }, []);

  return {
    loadingStep1,
    errorStep1,
    step1Result,
    checkDiseaseStatus,
    loadingStep2,
    errorStep2,
    step2Result,
    getDiseaseCategory,
    loadingAttributes,
    errorAttributes,
    attributesResult,
    getDiagnosisAttributes,
    loadingDetailedDiagnosis,
    errorDetailedDiagnosis,
    detailedDiagnosisResult,
    submitDetailedDiagnosis,
  };
}