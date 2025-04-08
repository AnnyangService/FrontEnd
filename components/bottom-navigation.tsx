"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ClipboardList, Home, User } from "lucide-react"

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t bg-white">
      <div className="flex justify-around py-3">
        <Link href="/records" className="flex flex-col items-center">
          <ClipboardList className={`w-6 h-6 ${pathname.includes("/records") ? "text-blue-500" : "text-gray-400"}`} />
          <span className={`text-xs mt-1 ${pathname.includes("/records") ? "text-blue-500" : "text-gray-400"}`}>
            기록
          </span>
        </Link>
        <Link href="/" className="flex flex-col items-center">
          <Home className={`w-6 h-6 ${pathname === "/" ? "text-blue-500" : "text-gray-400"}`} />
          <span className={`text-xs mt-1 ${pathname === "/" ? "text-blue-500" : "text-gray-400"}`}>홈</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center">
          <User className={`w-6 h-6 ${pathname.includes("/profile") ? "text-blue-500" : "text-gray-400"}`} />
          <span className={`text-xs mt-1 ${pathname.includes("/profile") ? "text-blue-500" : "text-gray-400"}`}>
            내정보
          </span>
        </Link>
      </div>
    </div>
  )
}

