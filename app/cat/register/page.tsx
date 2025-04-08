
"use client"

import { useState } from "react"
import Header from "@/components/header"
import Image from "next/image"
import { Calendar } from "lucide-react"

export default function RegisterCatPage() {
  const [gender, setGender] = useState<string | null>(null)
  const [breed, setBreed] = useState<string>("") // ✅ 추가

  return (
    <div className="pb-16">
      <Header title="내 고양이 등록" backUrl="/profile" />

      <div className="p-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Image src="/placeholder.svg?height=48&width=48" alt="이미지 추가" width={48} height={48} />
          </div>
          <button className="text-blue-500">사진 등록하기</button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">이름</label>
            <input type="text" placeholder="고양이 이름을 입력하세요" className="w-full p-3 border rounded-lg" />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">생년월일</label>
            <div className="relative">
              <input type="text" placeholder="YYYY.MM.DD" className="w-full p-3 border rounded-lg" />
              <Calendar className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">품종</label>
            <div className="relative">
              <select
                className="w-full p-3 border rounded-lg appearance-none"
                value={breed} // ✅ 바인딩
                onChange={(e) => setBreed(e.target.value)} // ✅ 상태 업데이트
              >
                <option value="" disabled>품종을 선택하세요</option>
                <option value="코리안숏헤어">코리안숏헤어</option>
                <option value="페르시안">페르시안</option>
                <option value="러시안블루">러시안블루</option>
                <option value="샴">샴</option>
                <option value="노랑이">노랑이</option>
              </select>
              <div className="absolute right-3 top-3 pointer-events-none">▼</div>
            </div>
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
              <input type="number" placeholder="0.0" className="w-full p-3 border rounded-lg" />
              <span className="absolute right-3 top-3 text-gray-400">kg</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">특이사항</label>
            <textarea placeholder="특이사항을 입력하세요" className="w-full p-3 border rounded-lg h-24"></textarea>
          </div>

          <button className="w-full bg-blue-500 text-white p-4 rounded-lg mt-4">등록하기</button>
        </div>
      </div>
    </div>
  )
}
