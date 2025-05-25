import { useState } from 'react';
import { S3API } from '@/api/s3/s3.api';

interface UseS3UploadProps {
  category?: string;
}

interface S3UploadResult {
  objectUrl: string;
  fileName: string;
}

export function useS3Upload(props?: UseS3UploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 파일을 S3에 업로드합니다.
   * @param file - 업로드할 파일 객체
   * @returns 업로드된 파일의 URL과 파일명
   */
  const uploadFile = async (file: File): Promise<S3UploadResult> => {
    setUploading(true);
    setError(null);
    
    try {
      // 1. 파일명 추출 (원래 파일명 사용)
      const fileName = file.name;
      
      // 2. Presigned URL 요청 - 파일명만 전달하면 서버에서 확장자 기반으로 contentType 결정
      const presignedData = await S3API.getPresignedUrl({
        fileName,
        category: props?.category
      });
      
      // 3. 이미지 S3에 업로드 - 서버에서 받은 contentType 사용
      const objectUrl = await S3API.uploadWithPresignedUrl(
        presignedData.preSignedUrl,
        file,
        presignedData.contentType // 서버에서 결정된 contentType 사용
      );
      
      return {
        objectUrl,
        fileName: presignedData.fileName
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "파일 업로드 중 오류가 발생했습니다.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    uploading,
    error,
  };
}
