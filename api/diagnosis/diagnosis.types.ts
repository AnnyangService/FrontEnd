
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
  id: number;
  description: string;
}

export interface DetailedDiagnosisRequestBody {
  diagnosis_id: string;
  attributes: SubmittedAttribute[];
}

export interface DetailedDiagnosisResponse {
  diagnosis_id: string;
  category: string; // 예: "keratitis" - 세부 질병명
  confidence: number;
}
