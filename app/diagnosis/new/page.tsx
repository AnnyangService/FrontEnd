"use client"

/*여기서 step 1수행 후
나온 결과값들(id, isNormal, imageUrl, confidence) GET으로 결과값으로 전달하여 보여줌

*/

import { useRef, useState } from "react"
import Header from "@/components/header"
import Image from "next/image"
import { Camera, ImageIcon, Loader2 } from "lucide-react"
import { useDiagnosis } from "@/hooks/use-diagnosis" 
import { useS3Upload } from "@/hooks/use-s3-upload"
import { useRouter } from "next/navigation" 

export default function NewDiagnosisPage() {
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false) 
  const [error, setError] = useState<string | null>(null)
  const [uploadingStatus, setUploadingStatus] = useState<string | null>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const { checkDiseaseStatus } = useDiagnosis() 
  const { uploadFile, uploading } = useS3Upload({ category: 'diagnosis' })
  const router = useRouter() 

  ///////////이거 테스트용이니 나중에 지우기기
  const [testImageUrl, setTestImageUrl] = useState<string>("")

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 로컬 미리보기 URL 생성 (UI 표시용)
      const localPreviewUrl = URL.createObjectURL(file)
      setPreview(localPreviewUrl)
      setError(null) 
      setIsLoading(true)
      
      try {
        // 1. 먼저 S3에 이미지 업로드
        setUploadingStatus("이미지 업로드 중...")
        const { objectUrl } = await uploadFile(file)
        setUploadingStatus("이미지 분석 중...")
        
        // 2. S3 URL을 사용하여 진단 API 호출
        const diagnosisResponse = await checkDiseaseStatus(objectUrl) 

        if (diagnosisResponse) {
          // 결과 페이지로 데이터와 함께 이동 (S3 URL 사용)
          router.push(
            `/diagnosis/result?id=${diagnosisResponse.id}&isNormal=${diagnosisResponse.is_normal}&imageUrl=${encodeURIComponent(objectUrl)}&confidence=${diagnosisResponse.confidence}`
          )
        } else {
          setError("진단 결과를 받아오지 못했습니다.")
        }
      } catch (err) {
        console.error("Error during diagnosis:", err)
        setError(err instanceof Error ? err.message : "진단 중 에러가 발생했습니다.")
      } finally {
        setIsLoading(false) 
        setUploadingStatus(null)
      }
    }
  }

   // --- 테스트용 URL로 진단 실행하는 함수 추가 나중에 삭제---
  const handleDiagnoseWithUrl = async () => {
    if (!testImageUrl.trim()) {
      setError("테스트할 이미지 URL을 입력해주세요.");
      return;
    }
    setPreview(testImageUrl); 
    setError(null);
    setIsLoading(true);
    setUploadingStatus("입력된 URL로 이미지 분석 중...");

    try {
      const diagnosisResponse = await checkDiseaseStatus(testImageUrl);

      if (diagnosisResponse) {
        
        router.push(
          `/diagnosis/result?id=${diagnosisResponse.id}&isNormal=${diagnosisResponse.is_normal}&imageUrl=${encodeURIComponent(testImageUrl)}&confidence=${diagnosisResponse.confidence}`
        );
      } else {
        setError("진단 결과를 받아오지 못했습니다.");
      }
    } catch (err) {
      console.error("Error during diagnosis with URL:", err);
      setError(err instanceof Error ? err.message : "URL 진단 중 에러가 발생했습니다.");
    } finally {
      setIsLoading(false);
      setUploadingStatus(null);
    }
  };

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
        {isLoading && (
          <div className="flex flex-col items-center justify-center my-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
            <p className="text-center text-blue-500">{uploadingStatus || '진단 중입니다...'}</p>
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 text-red-500 rounded-md my-4">
            <p className="text-center">오류: {error}</p>
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