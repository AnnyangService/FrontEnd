
export interface DiagnosisRequestBody {
  imageUrl: string;
}

export interface DiagnosisResponse {
  id: string; // ULID
  is_normal: boolean;
  confidence: number;
}

export interface DiagnosisStep2Response {
  id: string;
  category: string;
  confidence: number;
}

export interface DiagnosisAttribute {
  id: number;
  description: string;
}

export interface DiagnosisStep3AttributesResponse {
  attributes: DiagnosisAttribute[];
}

export interface SubmittedAttribute {
  diagnosisRuleId: string;
  userResponse: string;
}

export interface DetailedDiagnosisRequestBody {
  diagnosisId: string;
  userResponses: SubmittedAttribute[];
}

export interface DetailedDiagnosisResponse {
  diagnosis_id: string;
  category: string; // 예: "keratitis" - 세부 질병명
  description: string; //질병 설명명
  confidence: number;
}
