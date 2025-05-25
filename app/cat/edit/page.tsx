"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/header";
import { useCatInfo } from "@/hooks/use-catInfo";
import { CatAPI } from "../../../api/cat/cat.api";
import { CatApiData } from "../../../api/cat/cat.types";

async function getCat(id: string): Promise<CatApiData["cat"]> {
  try {
    const response = await CatAPI.getCat(id);
    return response;
  } catch (error) {
    console.error("🐱 고양이 정보 조회 실패:", error);
    notFound(); // 404 페이지 이동
  }
}

export default function EditCatPage() {
  const searchParams = useSearchParams();
  const catId = searchParams.get("id");

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [breed, setBreed] = useState("");
  const [customBreed, setCustomBreed] = useState("");
  const [gender, setGender] = useState<string | null>(null);
  const [weight, setWeight] = useState<number>(0);
  const [specialNotes, setSpecialNotes] = useState("");
  const [image, setImage] = useState("");
  
  // 이미지 관련 상태 추가
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const { updateCat, deleteCat, uploadImage, loading, imageUploading } = useCatInfo();

  useEffect(() => {
    if (!catId) return;

    async function loadCat() {
      const data = await getCat(catId as string);
      setName(data.name);
      setBirthDate(data.birthDate);
      setBreed(data.breed);
      setGender(data.gender === "FEMALE" ? "암컷" : "수컷");
      setWeight(data.weight);
      setSpecialNotes(data.specialNotes);
      setImage(data.image);
    }

    loadCat();
  }, [catId]);

  const handleSubmit = async () => {
    if (!name || !birthDate || !gender || !breed) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    try {
      // 새 이미지가 있다면 업로드
      let imageUrl = image;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      await updateCat(catId!, {
        name,
        image: imageUrl || "",
        birthDate,
        breed: breed === "custom" ? customBreed : breed,
        gender: gender === "암컷" ? "FEMALE" : "MALE",
        weight,
        lastDiagnosis: birthDate,
        specialNotes,
      });
    } catch (e) {
      alert("수정에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("정말로 이 고양이 정보를 삭제하시겠습니까?");
    if (!confirmDelete || !catId) return;

    try {
      await deleteCat(catId);
    } catch (e) {
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="pb-16">
      <Header title="고양이 정보 수정" backUrl="/profile" />

      <div className="p-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            {previewUrl || image ? (
              <Image
                src={previewUrl || image}
                alt="고양이 이미지"
                width={160}
                height={160}
                className="rounded-full object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                이미지 없음
              </div>
            )}
          </div>
          <button
            className="text-blue-500"
            onClick={() => galleryInputRef.current?.click()}
            disabled={imageUploading}
          >
            {imageUploading ? "업로드 중..." : "사진 변경하기"}
          </button>
          <input
            type="file"
            accept="image/*"
            ref={galleryInputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImageFile(file);
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
              }
            }}
          />
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">생년월일</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">품종</label>
            <select
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              <option value="" disabled>선택하세요</option>
              <option value="코리안숏헤어">코리안숏헤어</option>
              <option value="페르시안">페르시안</option>
              <option value="러시안블루">러시안블루</option>
              <option value="샴">샴</option>
              <option value="노랑이">먼치킨</option>
              <option value="custom">직접 입력</option>
            </select>
            {breed === "custom" && (
              <input
                type="text"
                value={customBreed}
                onChange={(e) => setCustomBreed(e.target.value)}
                className="mt-2 w-full p-3 border rounded-lg"
              />
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">성별</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                className={`p-4 border rounded-lg ${gender === "암컷" && "bg-blue-100 text-blue-600"}`}
                onClick={() => setGender("암컷")}
              >
                암컷
              </button>
              <button
                className={`p-4 border rounded-lg ${gender === "수컷" && "bg-blue-100 text-blue-600"}`}
                onClick={() => setGender("수컷")}
              >
                수컷
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">체중</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value))}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">특이사항</label>
            <textarea
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || imageUploading}
            className={`w-full ${loading || imageUploading ? 'bg-gray-400' : 'bg-green-600'} text-white p-4 rounded-lg`}
          >
            {loading ? "수정 중..." : imageUploading ? "이미지 업로드 중..." : "수정 완료"}
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="w-full bg-red-500 text-white p-4 rounded-lg mt-2"
          >
            {loading ? "삭제 중..." : "고양이 정보 삭제"}
          </button>
        </div>
      </div>
    </div>
  );
}
