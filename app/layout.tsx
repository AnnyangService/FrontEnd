"use client"

import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import BottomNavigation from "@/components/bottom-navigation"
import { usePathname } from "next/navigation"
import AuthGuard from "@/components/auth-guard"
import LoginPage from "./login/page"
import SignupPage from "./sign_up/page"

const inter = Inter({ subsets: ["latin"] })

function getPage(pathname: string, children: ReactNode) {
  if(pathname === "/login") return <LoginPage />
  if(pathname === "/sign_up") return <SignupPage />
  return <AuthGuard>{children}</AuthGuard>
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <html lang="ko">
      <head>
        <title>Cat Health App</title>
        <meta name="description" content="고양이 건강 진단 및 기록 서비스" />
      </head>
      <body className={inter.className}>
        <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
          {getPage(pathname, children)}
          <BottomNavigation />
        </div>
      </body>
    </html>
  )
}
