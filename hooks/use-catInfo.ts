import { useState } from "react";
import { useRouter } from "next/navigation";
import { CatAPI } from "../api/cat/cat.api";
import { CatInputData } from "../api/cat/cat.types";

export function useCatInfo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const registerCat = async (cat: CatInputData['registerCat']) => {
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
    cat: CatInputData['registerCat']
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
    loading,
    error,
  };
}
