"use client"

import { Suspense, useEffect, useState } from "react"
import { notFound, useSearchParams } from "next/navigation"
import Header from "@/components/header"
import Image from "next/image"
import Link from "next/link"
import { Edit2, Cat as CatIcon } from "lucide-react"
import { CatAPI } from "@/api/cat/cat.api"
import { CatApiData } from "../../api/cat/cat.types"

function CatProfileContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [catInfo, setCatInfo] = useState<CatApiData['cat'] | null>(null);

  useEffect(() => {
    if (!id) return;
    async function loadCat() {
      try {
        const cat = await CatAPI.getCat(id as string);
        setCatInfo(cat);
      }
      catch (error) {
        console.error("Error fetching cat data:", error);
        notFound();
      }
    }
    loadCat();
  }, [id]);

  if (!catInfo) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white pb-16">
      <Header title="고양이 정보" backUrl="/profile" />

      {/* 이미지 영역 */}
      <div className="relative w-full h-64">
         {catInfo.image ? (
            <Image
              src={catInfo.image}
              alt={catInfo.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <CatIcon className="w-20 h-20 text-gray-400" />
            </div>
          )}
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
