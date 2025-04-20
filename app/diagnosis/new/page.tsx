"use client"

import { useRef, useState } from "react"
import Header from "@/components/header"
import Image from "next/image"
import { Camera, ImageIcon } from "lucide-react"

export default function NewDiagnosisPage() {
  const [preview, setPreview] = useState<string | null>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setPreview(imageUrl)

      console.log("선택된 파일 이름:", file.name)
      console.log("파일 타입:", file.type)
      console.log("파일 크기 (bytes):", file.size)
    }
  }

  return (
    <main className="max-w-md mx-auto bg-white min-h-screen flex flex-col pb-16">
      <Header title="새로운 진단" backUrl="/" />

      <div className="p-4 flex-1">
        {/* ✅ 이미지 미리보기를 상단에 표시 */}
        {preview && (
          <div className="mb-6 rounded-lg overflow-hidden border">
            <Image
              src={preview}
              alt="미리보기"
              width={500}
              height={500}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

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

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            className="p-4 border rounded-lg flex flex-col items-center"
            onClick={() => cameraInputRef.current?.click()}
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <Camera className="w-6 h-6 text-blue-500" />
            </div>
            <span>카메라로 촬영</span>
          </button>

          <button
            className="p-4 border rounded-lg flex flex-col items-center"
            onClick={() => galleryInputRef.current?.click()}
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <ImageIcon className="w-6 h-6 text-green-500" />
            </div>
            <span>갤러리에서 선택</span>
          </button>
        </div>

        {/* 숨겨진 input */}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={cameraInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
        <input
          type="file"
          accept="image/*"
          ref={galleryInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
    </main>
  )
}
