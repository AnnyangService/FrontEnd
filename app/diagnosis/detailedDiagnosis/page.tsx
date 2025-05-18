//diagnosis/detaiedDiagnosis
"use client"
/* 세부질병진단 폼 */

import { useState } from "react"
import Header from "@/components/header"

export default function EyeDiagnosisFormPage() {
  const [formData, setFormData] = useState({
    question1: "",
    question2: "",
    question3: "",
    question4: "",
  })

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const isComplete = Object.values(formData).every(value => value.trim() !== "")

  const handleSubmit = () => {
    /*나중에 API구현되면 수정하기*/
    if (!isComplete) return
    console.log("제출된 데이터:", formData)
    alert("제출되었습니다.")
  }

  const questions = [
    /*질문목록 나중에 API로 받아오도록 설정하기*/
    /*place holder 나중에 빼기? */
    {
      name: "question1",
      label: "고양이 눈에 이상이 있나요?",
      placeholder: "예: 충혈, 부종 등",
    },
    {
      name: "question2",
      label: "눈곱이 자주 생기나요?",
      placeholder: "예: 매일 생김, 가끔 있음 등",
    },
    {
      name: "question3",
      label: "눈물 양이 많아졌나요?",
      placeholder: "예: 이전보다 흐름이 많음",
    },
    {
      name: "question4",
      label: "눈을 자주 비비거나 긁나요?",
      placeholder: "예: 발로 자주 긁음",
    },
  ]

  return (
    <div className="pb-16">
      <Header title="자세한 정보를 알려주세요" backUrl="/" />

      <div className="px-4 py-6 space-y-8">
        {questions.map(({ name, label, placeholder }, idx) => {
          const value = (formData as any)[name]
          const isFilled = value.trim() !== ""

          return (
            <div key={name} className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <label className="block font-semibold mb-2 text-gray-800">
                <span className="text-blue-600 mr-1">Q{idx + 1}.</span>
                {label}
              </label>

              <div className="relative">
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`
                        w-full h-12 p-3 rounded-lg outline-none transition
                        ${isFilled ? "border-blue-500" : "border-red-500"}
                        focus:border-blue-500 focus:ring-2 focus:ring-blue-300
                    `}
                    />

                {isFilled && (
                  <span className="absolute right-3 top-3 text-green-500 text-lg">✔️</span>
                )}
              </div>
            </div>
          )
        })}

        {!isComplete && (
          <p className="text-sm text-red-500 -mt-4">모든 항목을 입력해야 제출할 수 있어요.</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!isComplete}
          className={`w-full py-3 rounded-lg mt-4 transition text-center font-semibold ${
            isComplete
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          제출
        </button>
      </div>
    </div>
  )
}
