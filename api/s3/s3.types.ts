
export interface PresignedUrlResponse {
  preSignedUrl: string;
  fileName: string;
  contentType: string;
  objectUrl: string;
}

export interface PresignedUrlRequest {
  fileName: string;
  category?: string;
}
