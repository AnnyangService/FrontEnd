import { useState } from "react";
import { useRouter } from "next/navigation";
import { CatAPI } from "../api/cat/cat.api";
import { CatInputData } from "../api/cat/cat.types";
import { useS3Upload } from "./use-s3-upload";

export function useCatInfo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // S3 업로드 훅 사용
  const { uploadFile, uploading: imageUploading, error: uploadError } = useS3Upload({
    category: 'cats'
  });

  // 기존 uploadImage 함수를 S3Upload 훅을 사용하도록 수정
  const uploadImage = async (file: File): Promise<string> => {
    try {
      const result = await uploadFile(file);
      return result.objectUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "이미지 업로드 중 에러가 발생했습니다.");
      throw err;
    }
  };

  const registerCat = async (cat: CatInputData["registerCat"]) => {
    setLoading(true);
    setError(null);

    try {
      await CatAPI.registerCat(cat);
      alert("고양이 정보가 등록되었습니다.");
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "에러가 발생했습니다.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCat = async (
    id: string,
    cat: CatInputData["registerCat"]
  ) => {
    setLoading(true);
    setError(null);

    try {
      await CatAPI.updateCat(id, cat);
      alert("고양이 정보가 수정되었습니다.");
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "에러가 발생했습니다.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCat = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await CatAPI.deleteCat(id);
      alert("고양이 정보가 삭제되었습니다.");
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "에러가 발생했습니다.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    registerCat,
    updateCat,
    deleteCat,
    uploadImage,
    loading,
    imageUploading,
    error,
  };
}
