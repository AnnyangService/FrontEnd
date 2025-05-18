"use client"

import { useRef, useState } from "react"
import Header from "@/components/header"
import Image from "next/image"
import { useCatInfo} from "@/hooks/use-catInfo";


export default function RegisterCatPage() {
  const [gender, setGender] = useState<string | null>(null)
  const [breed, setBreed] = useState<string>("")
  const [customBreed, setCustomBreed] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [name, setName] = useState("");
  const [weight, setWeight] = useState<number>(0);
  const [specialNotes, setSpecialNotes] = useState("");
  const { registerCat, loading } = useCatInfo();



  // 이미지 미리보기 URL 상태
  const [previewUrl, setPreviewUrl] = useState<string>("")

  const galleryInputRef = useRef<HTMLInputElement>(null)

  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
  }

  const handleSubmit = async () => {
  if (!name || !selectedDate || !gender || !breed) {
    alert("모든 항목을 입력해주세요.");
    return;
  }

  try {
    await registerCat({
      name,
      image: previewUrl || "", 
      birthDate: selectedDate,
      breed: breed === "custom" ? customBreed : breed,
      gender: gender === "암컷" ? "FEMALE" : "MALE",
      weight,
      lastDiagnosis: selectedDate,
      specialNotes,
    });
  } catch (e) {
    alert("등록에 실패했습니다.");
  }
};


  return (
    <div className="pb-16">
      <Header title="내 고양이 등록" backUrl="/profile" />

      <div className="p-4">
        <div className="flex flex-col items-center mb-8">
          {/* 이미지 영역을 더 크게 조정 */}
          <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Image
              src={previewUrl || "/placeholder.svg?height=160&width=160"}
              alt="이미지 추가"
              width={160}
              height={160}
              className="rounded-full object-cover w-full h-full"
            />
          </div>
          <button
            className="text-blue-500"
            onClick={() => galleryInputRef.current?.click()}
          >
            사진 등록하기
          </button>
          <input
            type="file"
            accept="image/*"
            ref={galleryInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">이름</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="고양이 이름을 입력하세요" className="w-full p-3 border rounded-lg" />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">생년월일</label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* ✅ 품종 선택 */}
          <div>
            <label className="block text-gray-700 mb-2">품종</label>
            <select
              className="w-full p-3 border rounded-lg appearance-none"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
            >
              <option value="" disabled>품종을 선택하세요</option>
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
                placeholder="직접 입력하세요"
                className="mt-2 w-full p-3 border rounded-lg"
              />
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">성별</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                className={`p-4 border rounded-lg text-center ${gender === "암컷" ? "bg-blue-100 text-blue-600 border-blue-300" : ""}`}
                onClick={() => setGender("암컷")}
              >
                암컷
              </button>
              <button
                className={`p-4 border rounded-lg text-center ${gender === "수컷" ? "bg-blue-100 text-blue-600 border-blue-300" : ""}`}
                onClick={() => setGender("수컷")}
              >
                수컷
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">체중</label>
            <div className="relative">
              <input type="number" value={weight} onChange={(e) => setWeight(parseFloat(e.target.value))} placeholder="0.0" className="w-full p-3 border rounded-lg" />
              <span className="absolute right-3 top-3 text-gray-400">kg</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">특이사항</label>
            <textarea value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)} placeholder="특이사항을 입력하세요" className="w-full p-3 border rounded-lg h-24"></textarea>
          </div>

          <button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-500 text-white p-4 rounded-lg mt-4">{loading ? "등록 중..." : "등록하기"}</button>
        </div>
      </div>
    </div>
  )
}
