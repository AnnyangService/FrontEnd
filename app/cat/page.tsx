"use client"

import { Suspense, useEffect, useState } from "react"
import { notFound, useSearchParams } from "next/navigation"
import Header from "@/components/header"
import Image from "next/image"
import Link from "next/link"
import { Edit2 } from "lucide-react"
import { Cat } from "@/lib/types/cat"
import { API_ENDPOINTS } from "@/lib/constants"
import { fetchApi } from "@/lib/fetch-api"

async function getCat(id: string): Promise<Cat> {
  try {
    const response = await fetchApi<Cat>(API_ENDPOINTS.GET_CAT(id));
    return response.data;
  } catch (error) {
    notFound();
  }
}

function CatProfileContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [catInfo, setCatInfo] = useState<Cat | null>(null);

  useEffect(() => {
    if (!id) return;
    async function loadCat() {
      const data = await getCat(id as string);
      setCatInfo(data);
    }
    loadCat();
  }, [id]);

  if (!catInfo) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white pb-16">
      <Header title="고양이 정보" backUrl="/profile" />

      {/* 이미지 영역 */}
      <div className="relative w-full h-64">
        <Image
          src={catInfo.image}
          alt={catInfo.name}
          fill
          className="object-cover"
        />
        <Link
          href={`/cat/edit?id=${catInfo.id}`}
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
        <InfoRow label="체중(kg)" value={catInfo.weight?.toString()} />
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

export default function CatProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CatProfileContent />
    </Suspense>
  );
}
