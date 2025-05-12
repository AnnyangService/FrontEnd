"use client"

import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter, usePathname } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, checkAuth } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // ✅ 무조건 실행 (조건문 밖!)
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // ✅ 보호된 경로 확인 후 리디렉션도 Hook 내부에서
  useEffect(() => {
    const publicRoutes = ["/login", "/sign_up"]
    const isPublic = publicRoutes.includes(pathname)

    if (!isPublic && !loading && !user) {
      router.push("/login")
    }
  }, [pathname, loading, user, router])

  const publicRoutes = ["/login", "/sign_up"]
  const isPublic = publicRoutes.includes(pathname)

  if (!isPublic && (loading || !user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>로딩 중...</div>
      </div>
    )
  }

  return <>{children}</>
}
