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
    
    /*
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
    */
    try {
      const response = await api.get<ApiResponse<DiagnosisStep2Response>>(`/diagnosis/step2/${diagnosisId}`);
      
      // 분석이 아직 진행중인 경우 - 서버 응답 형태에 맞게 수정 필요
      if (!response.data.data || response.data.status === 'processing') {
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
    
    
    //return mockResponse;
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
    //질문 개수 정해져있으면 이거 그냥 프론트엔드단으로 옮기기
    const mockResponse: DiagnosisStep3AttributesResponse = {
      attributes: [
        { id: 1, description: "분비물의 특성은 어떤가요?" },
        { id: 2, description: "질병의 진행 속도는 어떤 편인가요?" },
        { id: 3, description: "주요 증상을 자세하게 알려주세요" },
        { id: 4, description: "한쪽 눈에만 증상이 있나요? 양쪽 눈에 증상이 있나요?" }
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
    
    /* 모킹 데이터
    const mockResponse: DetailedDiagnosisResponse = {
      diagnosis_id: requestData.diagnosis_id,
      category: "세균성 결막염", // 예시 세부 질병명
      confidence: 0.92,
      description : "## 의료 보고서: 비궤양성 각막염 진단 결과 및 보호자를 위한 안내\n\n**1. 진단 결과 요약**\n\n보호자님께서 제공해주신 정보를 종합적으로 분석한 결과, 환자는 **비궤양성 각막염**으로 진단되었습니다. 비궤양성 각막염은 각막 표면에 궤양이 생기지 않은 각막의 염증 질환입니다. 현재 환자는 눈물 과다, 미세한 분비물, 점진적인 진행 속도, 눈 뜨는데 어려움 없음, 매끄러운 각막 표면 등의 특징을 보이고 있으며, 이러한 증상들이 비궤양성 각막염의 특징과 매우 유사합니다.\n\n**2. 증상 분석 설명**\n\n*   **분비물 특성:** 환자는 주로 눈물을 많이 흘리고 미세한 분비물을 보이는 것으로 확인되었습니다. 이는 비궤양성 각막염의 특징적인 증상과 85.7%의 유사도를 보입니다. 안검염이나 결막염과도 유사성이 있지만, 눈물 과다 증상이 더 뚜렷하게 나타나는 점이 비궤양성 각막염에 더 가깝습니다.\n*   **진행 속도:** 증상이 천천히 진행되는 양상을 보이며, 이는 비궤양성 각막염의 점진적인 진행 속도와 84.5%의 유사도를 나타냅니다. 결막염이나 안검염 또한 천천히 진행될 수 있지만, 비궤양성 각막염의 특징적인 진행 양상과 더 일치합니다.\n*   **주요 증상:** 눈물을 흘리지만 눈 뜨는데 어려움이 없고 각막 표면이 매끄러운 상태는 비궤양성 각막염의 주요 특징과 90.6%의 높은 유사도를 보입니다. 이는 각막 궤양이 없는 비궤양성 각막염의 특징을 잘 나타냅니다.\n*   **발생 패턴:** 한쪽 눈에서만 증상이 발생하는 것은 결막염과 유사도가 높지만 (82.7%), 비궤양성 각막염 또한 한쪽 눈에서 발생할 수 있습니다 (81.2%).\n\n**3. 주의사항 및 권고사항**\n\n*   **정확한 원인 파악:** 비궤양성 각막염은 다양한 원인에 의해 발생할 수 있습니다. 알레르기, 건조한 환경, 감염 등이 원인이 될 수 있으므로, 정확한 원인을 파악하기 위해 안과 전문의의 진료를 받는 것이 중요합니다.\n*   **정기적인 검진:** 비궤양성 각막염은 만성적으로 진행될 수 있으며, 드물게 시력 저하를 유발할 수도 있습니다. 정기적인 안과 검진을 통해 질병의 진행 상황을 확인하고 적절한 치료를 받는 것이 중요합니다.\n*   **눈 건강 관리:**\n    *   **인공눈물 사용:** 눈의 건조함을 완화하고 각막을 보호하기 위해 인공눈물을 자주 사용해주세요.\n    *   **눈꺼풀 청결 유지:** 눈꺼풀에 염증이 생기지 않도록 깨끗하게 유지해주세요.\n    *   **눈 비비지 않기:** 눈을 비비는 행동은 각막에 자극을 줄 수 있으므로 피해주세요.\n    *   **자극 물질 피하기:** 먼지, 연기, 강한 햇빛 등 눈에 자극을 줄 수 있는 환경을 피해주세요.\n*   **처방된 약물 사용:** 안과 전문의가 처방한 약물(안약, 연고 등)을 지시에 따라 정확하게 사용해주세요.\n*   **경과 관찰:** 증상이 악화되거나 새로운 증상이 나타나는 경우 즉시 안과 전문의에게 문의해주세요.\n\n**안심하세요!** 비궤양성 각막염은 적절한 치료와 관리를 통해 증상을 완화하고 악화를 방지할 수 있습니다. 위에 제시된 주의사항을 잘 지키고, 안과 전문의와 긴밀하게 협력하여 환자의 눈 건강을 지켜주시길 바랍니다. 궁금한 점이 있으시면 언제든지 문의해주세요.\n"
    };*/
    
    // 실제 구현 시 아래 주석 해제 및 모킹 코드 제거
    
    const response = await api.post<ApiResponse<DetailedDiagnosisResponse>>('/diagnosis/step3', requestData);
    if (!response.data.success) {
      throw new Error(response.data.error.message);
    }
    return response.data.data;
    
    
    //return mockResponse;
  }
};
