import { useState, useCallback } from 'react';
import { API_ENDPOINTS } from '@/lib/constants';
import { DiagnosisAPI } from '@/api/diagnosis/diagnosis.api';
import {
  DiagnosisResponse,
  DiagnosisStep2Response,
  DiagnosisStep3AttributesResponse,
  DetailedDiagnosisRequestBody,
  DetailedDiagnosisResponse
} from '@/api/diagnosis/diagnosis.types';

/*
****질병 진단 API 호출을 위한 훅****
step1 -> 질병 여부 판단
step2 -> 질병 대분류
step3 -> 세부질병 판별 위한 질문 목록
step4 -> 세부질병 질문에 대한 결과값
*/

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
  const checkDiseaseStatus = useCallback(async (imageUrl: string): Promise<DiagnosisResponse | null> => {
    setLoadingStep1(true);
    setErrorStep1(null);
    setStep1Result(null); 

    if (!imageUrl) {
      setErrorStep1("이미지 URL이 존재하지 않습니다.");
      setLoadingStep1(false);
      return null;
    }

    try {
      const result = await DiagnosisAPI.checkDiseaseStatus(imageUrl);
      setStep1Result(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '질병 여부 판단 중 에러가 발생했습니다.';
      setErrorStep1(errorMessage);
      console.error("Error checking disease status:", err);
      return null;
    } finally {
      setLoadingStep1(false);
    }
  }, []);

  // 1-2. 질병 대분류 판단 요청 API 호출(GET)
  // 이거 질병 있으면 그냥 알아서 step2실행해주니까 사용X(ID로 가져오기만)
  const getDiseaseCategory = useCallback(async (diagnosisId: string): Promise<DiagnosisStep2Response | null> => {
    setLoadingStep2(true);
    setErrorStep2(null);
    setStep2Result(null);

    // diagnosisId 유효성 검사
    if (typeof diagnosisId !== 'string' || !diagnosisId) {
      setErrorStep2("진단 ID가 유효하지 않습니다.");
      setLoadingStep2(false);
      return null;
    }

    try {
      const result = await DiagnosisAPI.getDiseaseCategory(diagnosisId);
      setStep2Result(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '질병 대분류 판단 결과 조회 중 에러가 발생했습니다.';
      setErrorStep2(errorMessage);
      console.error("Error getting disease category (Step 2):", err);
      return null;
    } finally {
      setLoadingStep2(false);
    }
  }, []);

  // 1-3. 세부 질병 진단에 필요한 속성(질문) 목록 조회 (GET)
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
      const result = await DiagnosisAPI.getDiagnosisAttributes(diagnosisId);
      setAttributesResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '세부 진단 속성 목록 조회 중 에러가 발생했습니다.';
      setErrorAttributes(errorMessage);
      console.error("Error getting diagnosis attributes (Step 3):", err);
      return null;
    } finally {
      setLoadingAttributes(false);
    }
  }, []);

  // 1-4. 세부 질병 진단 결과 요청 (POST)
  const submitDetailedDiagnosis = useCallback(async (
    requestData: DetailedDiagnosisRequestBody
  ): Promise<DetailedDiagnosisResponse | null> => {
    setLoadingDetailedDiagnosis(true);
    setErrorDetailedDiagnosis(null);
    setDetailedDiagnosisResult(null);

    // 요청 데이터 유효성 검사
    if (!requestData.diagnosis_id || !requestData.attributes || requestData.attributes.length === 0) {
      setErrorDetailedDiagnosis("진단 ID와 선택된 속성 값들이 필요합니다.");
      setLoadingDetailedDiagnosis(false);
      return null;
    }

    try {
      const result = await DiagnosisAPI.submitDetailedDiagnosis(requestData);
      setDetailedDiagnosisResult(result);
      return result;
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