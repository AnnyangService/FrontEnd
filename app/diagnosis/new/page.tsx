"use client"

import { useState } from "react"
import Header from "@/components/header"
import Image from "next/image"
import { Camera, ImageIcon } from "lucide-react"

export default function NewDiagnosisPage() {
  const [selectedCat, setSelectedCat] = useState<string | null>(null)

  return (
    <div className="pb-16">
      <Header title="새로운 진단" backUrl="/" />

      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">진단할 고양이 선택</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              className={`p-4 border rounded-lg flex flex-col items-center ${selectedCat === "미오" ? "border-blue-500 bg-blue-50" : ""}`}
              onClick={() => setSelectedCat("미오")}
            >
              <Image src="/images/cat-mio.png" alt="미오" width={80} height={80} className="rounded-full mb-2" />
              <span>미오</span>
            </button>
            <button
              className={`p-4 border rounded-lg flex flex-col items-center ${selectedCat === "나비" ? "border-blue-500 bg-blue-50" : ""}`}
              onClick={() => setSelectedCat("나비")}
            >
              <Image src="/images/cat-nabi.png" alt="나비" width={80} height={80} className="rounded-full mb-2" />
              <span>나비</span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">사진 촬영 방법</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="list-disc pl-5 space-y-2">
              <li>고양이의 눈을 정면에서 촬영해주세요.</li>
              <li>밝은 곳에서 촬영하면 더 정확한 진단이 가능합니다.</li>
              <li>플래시를 사용하지 마세요.</li>
              <li>눈 주변이 잘 보이도록 촬영해주세요.</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="p-4 border rounded-lg flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <Camera className="w-6 h-6 text-blue-500" />
            </div>
            <span>카메라로 촬영</span>
          </button>
          <button className="p-4 border rounded-lg flex flex-col items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <ImageIcon className="w-6 h-6 text-green-500" />
            </div>
            <span>갤러리에서 선택</span>
          </button>
        </div>
      </div>
    </div>
  )
}

