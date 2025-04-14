"use client"

import { useState } from "react"
import Header from "@/components/header"
import Image from "next/image"
import { Camera, ImageIcon } from "lucide-react"

export default function NewDiagnosisPage() {
  const [selectedCat, setSelectedCat] = useState<string | null>(null)

  return (
    <main className="max-w-md mx-auto bg-white min-h-screen flex flex-col pb-16">
      <Header title="새로운 진단" backUrl="/" />

      <div className="p-4 flex-1">
        

        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">사진 촬영 방법</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="list-disc pl-5 space-y-2 text-sm">
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
    </main>
  )
}
