"use client"

import Header from "@/components/header"
import Image from "next/image"
import Link from "next/link"
import { Edit2 } from "lucide-react"

export default function CatProfilePage({ params }: { params: { id: string } }) {
  // 여기서는 id가 1인 경우 미오의 정보를 보여줍니다
  const catInfo = {
    id: params.id,
    name: "미오",
    image: "/images/cat-closeup.png",
    birthDate: "2023년 3월 15일",
    breed: "노랑이",
    gender: "암컷",
    weight: "4.2kg",
    lastDiagnosis: "2025.02.15",
    specialNotes: "알레르기 있음 (생선)",
  }

  return (
    <main className="max-w-md mx-auto bg-white min-h-screen flex flex-col pb-16">
      <Header title="고양이 정보" backUrl="/profile" showSettings />

      <div className="relative">
        <Image
          src={catInfo.image || "/placeholder.svg"}
          alt={catInfo.name}
          width={600}
          height={400}
          className="w-full h-64 object-cover"
        />
        <Link href={`/cat/${catInfo.id}/edit`} className="absolute top-4 right-4 bg-white p-2 rounded-full">
          <Edit2 className="w-5 h-5" />
        </Link>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{catInfo.name}</h2>
          
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-gray-500">생년월일</h3>
            <p>{catInfo.birthDate}</p>
          </div>

          <div>
            <h3 className="text-gray-500">품종</h3>
            <p>{catInfo.breed}</p>
          </div>

          <div>
            <h3 className="text-gray-500">성별</h3>
            <p>{catInfo.gender}</p>
          </div>

          <div>
            <h3 className="text-gray-500">체중</h3>
            <p>{catInfo.weight}</p>
          </div>

          <div>
            <h3 className="text-gray-500">최근 진단</h3>
            <p>{catInfo.lastDiagnosis}</p>
          </div>

          <div>
            <h3 className="text-gray-500">특이사항</h3>
            <p>{catInfo.specialNotes}</p>
          </div>
        </div>
      </div>
    </main>
  )
}
