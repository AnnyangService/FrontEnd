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
    console.log("🐾 세부 질병 진단 요청:", requestData);
    
    // 요청하신 새로운 형식의 모킹 데이터
    const mockResponse: DetailedDiagnosisResponse = {
      "category": "비궤양성 각막염",
      "summary": "🔍 진단 결과: 비궤양성 각막염\n• 분비물 특성: 비궤양성 각막염 (85.7% 유사)\n• 진행 속도: 비궤양성 각막염 (84.5% 유사)\n• 주요 증상: 비궤양성 각막염 (90.6% 유사)\n• 발생 패턴: 결막염 (82.7% 유사)\n\n📊 전체 유사도 분석:\n• 비궤양성 각막염: 85.5%\n• 안검염: 85.1%\n• 결막염: 84.7%",
      "details": "# 1. 비궤양성 각막염이란?\n\n## [질병 개요]\n비궤양성 각막염은 각막 표면에 궤양이 없는 상태에서 각막에 염증이 발생하는 질환입니다. 궤양이 없어 각막 손상이 심각하지 않은 경우가 많지만, 방치하면 시력 저하를 유발할 수 있습니다. 품종, 환경, 면역 등 다양한 요인이 복합적으로 작용하여 발생할 수 있습니다.\n\n## [주요 증상]\n* 눈물 과다\n* 미세한 눈곱\n* 눈부심 (심한 경우)\n* 각막 혼탁 (심한 경우)\n* 눈꺼풀 경련 (심한 경우)\n\n# 2. 관찰된 증상과의 일치도\n\n## [일치하는 증상]\n* **분비물 특성:** 눈물 과다 및 미세한 분비물은 비궤양성 각막염의 특징적인 증상입니다.\n* **진행 속도:** 점진적인 진행은 비궤양성 각막염의 일반적인 경과와 부합합니다.\n* **주요 증상:** 눈물 흘림과 매끄러운 각막 표면은 각막 궤양이 없는 비궤양성 각막염을 시사합니다.\n\n## [주의할 증상]\n한쪽 눈에서만 증상이 나타나는 것은 비궤양성 각막염과 일치하지만, 결막염 등 다른 질환의 가능성도 배제할 수 없습니다. 정확한 감별 진단을 위해 수의사의 검진이 필요합니다.\n\n# 3. 주의사항 및 권고사항\n\n## [치료 방향]\n* 항생제, 소염제 안약, 인공 눈물 등을 사용하여 염증을 완화하고 각막을 보호합니다.\n* 알레르기, 세균 감염 등 원인이 밝혀진 경우, 해당 원인을 치료합니다.\n* 먼지, 건조한 공기 등 각막을 자극할 수 있는 환경 요인을 개선합니다.\n\n자가 진단이나 임의적인 약물 사용은 상태를 악화시킬 수 있으므로, 반드시 수의사의 지시에 따라 치료해야 합니다.\n\n## [예후 및 관리]\n* 정기적인 검진을 통해 각막 상태를 확인합니다.\n* 눈 주변을 청결하게 유지하고, 눈곱이 생기면 부드러운 천으로 닦아줍니다.\n* 실내 습도를 적절하게 유지하여 각막 건조를 예방합니다.\n* 먼지, 연기, 화학 물질 등 각막을 자극할 수 있는 물질을 피합니다.\n\n이 보고서는 참고 자료이며, 수의사의 정확한 진단을 통해 치료 계획을 세우시길 바랍니다. 빠른 시일 내에 동물병원에 방문하여 상담받으시길 권장합니다.\n",
      "attribute_analysis": {
        "분비물 특성": {
          "user_input": "주로 눈문을 많이 흘리고 미세하게 분비물이 있어요.",
          "most_similar_disease": "비궤양성 각막염","similarity": 0.8570659458637238, "all_similarities": {},
          "llm_analysis": "# 1. 비궤양성 각막염와 유사성\n\n## [일치하는 점]\n미세한 분비물과 눈물 위주의 증상, 눈을 뜨는데 어려움이 없는 점이 비궤양성 각막염의 특징과 부합합니다. 급성적인 증상이 아니라는 점도 비궤양성 각막염의 점진적인 진행 경향과 유사합니다.\n\n## [주의할 점]\n각막 표면이 매끄러운지 확인해야 합니다. 비궤양성 각막염은 각막 궤양이 없는 것이 특징입니다. 통증 정도를 파악하여 비궤양성 각막염의 일반적인 통증 정도와 비교해야 합니다.\n\n# 2. 다른 질병과의 차이점\n\n## [차이점 분석]\n안검염은 눈꺼풀 주변의 각질이나 기름기 있는 분비물이 주 증상인 반면, 현재 증상은 눈물과 미세한 분비물에 집중되어 있습니다. 결막염은 분비물의 종류가 다양하고 결막 충혈, 부종을 동반하는 경우가 많지만, 현재 증상은 미세한 분비물과 눈물에 국한되어 있습니다."
        },
        "진행 속도": {
          "user_input": "천천히 진행돼요.","most_similar_disease": "비궤양성 각막염","similarity": 0.8445415794849396,"all_similarities": {},
          "llm_analysis": "# 1. 비궤양성 각막염와 유사성\n\n## [일치하는 점]\n* 점진적인 진행 속도가 \"천천히 진행\"되는 증상과 부합합니다.\n* 눈물과 같은 미세한 분비물을 동반할 수 있습니다.\n* 눈을 뜨는데 어려움이 없고 각막 표면이 매끄러우며 눈물을 흘리는 증상이 나타날 수 있습니다."
        }
      }
    };
    
    // 실제 구현 시 아래 주석 해제 및 모킹 코드 제거
    /*
    const response = await api.post<ApiResponse<DetailedDiagnosisResponse>>('/diagnosis/step3', requestData);
    if (!response.data.success) {
      throw new Error(response.data.error.message);
    }
    return response.data.data;
    */
    
    return mockResponse;
  }
};
