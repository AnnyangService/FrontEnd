import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@/lib/constants";

export function useCatInfo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const registerCat = async (cat: {
    name: string;
    image: string;
    birthDate: string;
    breed: string;
    gender: "MALE" | "FEMALE";
    weight: number;
    lastDiagnosis: string;
    specialNotes: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINTS.REGISTER_CAT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(cat),
      });

      const data = await response.json();

      console.log("🐾 등록 응답 상태:", response.status);
      console.log("🐾 등록 응답 본문:", data);

      if (!response.ok || data.success === false) {
        throw new Error(data?.error?.message || "고양이 등록에 실패했습니다.");
      }

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
    cat: {
      name: string;
      image: string;
      birthDate: string;
      breed: string;
      gender: "MALE" | "FEMALE";
      weight: number;
      lastDiagnosis: string;
      specialNotes: string;
    }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINTS.GET_CAT(id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(cat),
      });

      const data = await response.json();

      console.log("✏️ 수정 응답 상태:", response.status);
      console.log("✏️ 수정 응답 본문:", data);

      if (!response.ok || data.success === false) {
        throw new Error(data?.error?.message || "고양이 수정에 실패했습니다.");
      }

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
      const response = await fetch(API_ENDPOINTS.GET_CAT(id), {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      console.log("🗑️ 삭제 응답 상태:", response.status);
      console.log("🗑️ 삭제 응답 본문:", data);

      if (!response.ok || data.success === false) {
        throw new Error(data?.error?.message || "고양이 삭제에 실패했습니다.");
      }

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
