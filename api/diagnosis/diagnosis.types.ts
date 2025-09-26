
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

/*export interface DetailedDiagnosisResponse {
  diagnosis_id: string;
  category: string; // 예: "keratitis" - 세부 질병명
  description: string; //질병 설명명
  confidence: number;
}*/

export interface AttributeAnalysis {
  user_input: string;
  most_similar_disease: string;
  similarity: number;
  all_similarities: { [key: string]: number };
  llm_analysis: string;
}

export interface DetailedDiagnosisData {
  category: string;
  summary: string;
  details: string;
  attribute_analysis: {
    [key: string]: AttributeAnalysis;
  };
}

export interface DetailedDiagnosisResponse {
  category: string;
  summary: string;
  details: string;
  attribute_analysis: {
    [key: string]: AttributeAnalysis;
  };
}

export interface Diagnosis {
  id: string;
  confidence: number;
  normal: boolean;
  image_url: string;
  is_normal: boolean;
  created_at: string;
  second_step: {
    category: string;
    confidence: number;
    created_at: string;
  } | null;
  third_step: {
    category: string;
    summary: string;
    details: string;
    attribute_analysis: {
      [key: string]: {
        llmAnalysis: string;
      };
    };
    created_at: string;
  } | null;
}

export interface GetMyDiagnosesData {
  diagnoses: Diagnosis[];
}
