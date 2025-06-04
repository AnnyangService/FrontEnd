import api from "../api";
import { ApiResponse } from "../api.types";
import { PresignedUrlRequest, PresignedUrlResponse } from "./s3.types";

export const S3API = {
  /**
   * 이미지 업로드를 위한 presigned URL을 요청합니다.
   * @param request - fileName(필수), category(선택)
   * @returns presigned URL 정보
   */
  getPresignedUrl: async (request: PresignedUrlRequest): Promise<PresignedUrlResponse> => {
    const response = await api.post<ApiResponse<PresignedUrlResponse>>('/storage/presigned-url', request);
    
    if (!response.data.success) {
      throw new Error(response.data.error.message);
    }
    
    return response.data.data;
  },

  /**
   * Presigned URL을 사용하여 S3에 직접 파일을 업로드합니다.
   * @param preSignedUrl - 업로드 url
   * @param file - 업로드할 파일 객체
   * @param contentType - 파일 타입
   * @returns 업로드 완료된 파일의 objectUrl
   */
  uploadWithPresignedUrl: async (
    preSignedUrl: string, 
    file: File, 
    contentType: string
  ): Promise<string> => {
    // axios가 아닌 fetch를 사용하여 S3에 직접 업로드
    const response = await fetch(preSignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': contentType,
        'x-amz-acl': 'public-read'
      }
  });

    if (!response.ok) {
      throw new Error('이미지 업로드에 실패했습니다.');
    }

    // preSignedUrl에서 objectUrl 추출 (쿼리 파라미터 제거)
    return preSignedUrl.split('?')[0];
  }
};
