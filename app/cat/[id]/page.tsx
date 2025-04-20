"use client"

import Header from "@/components/header"
import Image from "next/image"
import Link from "next/link"
import { Edit2 } from "lucide-react"
import { use } from "react"

export default function CatProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params) // ✅ params는 Promise이므로 use()로 불러와야 함

  const catInfo = {
    id,
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
    <div className="flex flex-col min-h-screen bg-white pb-16">
      <Header title="고양이 정보" backUrl="/profile"  />

      {/* 이미지 영역 */}
      <div className="relative w-full h-64">
        <Image
          src={catInfo.image}
          alt={catInfo.name}
          fill
          className="object-cover"
        />
        <Link
          href={`/cat/${catInfo.id}/edit`}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow"
        >
          <Edit2 className="w-5 h-5 text-gray-700" />
        </Link>
      </div>

      {/* 정보 영역 */}
      <div className="p-4 space-y-6 text-sm">
        <h2 className="text-2xl font-bold text-center">{catInfo.name}</h2>

        <InfoRow label="생년월일" value={catInfo.birthDate} />
        <InfoRow label="품종" value={catInfo.breed} />
        <InfoRow label="성별" value={catInfo.gender} />
        <InfoRow label="체중" value={catInfo.weight} />
        <InfoRow label="최근 진단" value={catInfo.lastDiagnosis} />
        <InfoRow label="특이사항" value={catInfo.specialNotes} />
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h3 className="text-gray-500 text-sm mb-1">{label}</h3>
      <p className="text-gray-900 text-base">{value}</p>
    </div>
  )
}
