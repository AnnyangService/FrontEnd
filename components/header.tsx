"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, MoreVertical, Settings } from "lucide-react"

interface HeaderProps {
  title: string
  backUrl?: string
  showSettings?: boolean
  showMoreOptions?: boolean
}

export default function Header({ title, backUrl, showSettings = false, showMoreOptions = false }: HeaderProps) {
  const router = useRouter()

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        {backUrl && (
          <button onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-xl font-medium">{title}</h1>
      </div>
      <div>
        {showSettings && (
          <Link href="/settings">
            <Settings className="w-6 h-6" />
          </Link>
        )}
        {showMoreOptions && (
          <button>
            <MoreVertical className="w-6 h-6" />
          </button>
        )}
      </div>
    </header>
  )
}
