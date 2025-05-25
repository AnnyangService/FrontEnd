"use client"

/*여기서 step 1수행 후
나온 결과값들(id, isNormal, imageUrl, confidence) GET으로 결과값으로 전달하여 보여줌

*/

import { useRef, useState } from "react"
import Header from "@/components/header"
import Image from "next/image"
import { Camera, ImageIcon } from "lucide-react"
import { useDiagnosis } from "@/hooks/use-diagnosis" 
import { useRouter } from "next/navigation" 

export default function NewDiagnosisPage() {
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false) 
  const [error, setError] = useState<string | null>(null) 
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const { checkDiseaseStatus } = useDiagnosis() 
  const router = useRouter() 

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setPreview(imageUrl)
      setError(null) 
      setIsLoading(true) 

      //일단 이미지 URL API전달하는식으로 구현.
      try {
      

        const diagnosisResponse = await checkDiseaseStatus(imageUrl) 

        if (diagnosisResponse) {
          // 결과 페이지로 데이터와 함께 이동
          router.push(
            `/diagnosis/result?id=${diagnosisResponse.id}&isNormal=${diagnosisResponse.is_normal}&imageUrl=${encodeURIComponent(imageUrl)}&confidence=${diagnosisResponse.confidence}`
          )
        } else {
          setError("진단 결과를 받아오지 못했습니다.")
        }
      } catch (err) {
        console.error("Error during diagnosis:", err)
        setError(err instanceof Error ? err.message : "진단 중 에러가 발생했습니다.")
      } finally {
        setIsLoading(false) 
      }
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

        {/* 로딩 및 에러 메시지 표시 */}
        {isLoading && <p className="text-center text-blue-500">진단 중입니다...</p>}
        {error && <p className="text-center text-red-500">오류: {error}</p>}

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
            onClick={() => !isLoading && cameraInputRef.current?.click()} // 로딩 중 클릭 방지
            disabled={isLoading} // 로딩 중 버튼 비활성화
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <Camera className="w-6 h-6 text-blue-500" />
            </div>
            <span>카메라로 촬영</span>
          </button>

          <button
            className="p-4 border rounded-lg flex flex-col items-center"
            onClick={() => !isLoading && galleryInputRef.current?.click()} // 로딩 중 클릭 방지
            disabled={isLoading} // 로딩 중 버튼 비활성화
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
          disabled={isLoading}
        />
        <input
          type="file"
          accept="image/*"
          ref={galleryInputRef}
          onChange={handleImageChange}
          className="hidden"
          disabled={isLoading}
        />
      </div>
    </main>
  )
}