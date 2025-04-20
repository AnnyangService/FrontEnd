import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import BottomNavigation from "@/components/bottom-navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Cat Health App",
  description: "고양이 건강 진단 및 기록 서비스",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
          {children}
          <BottomNavigation />
        </div>
      </body>
    </html>
  )
}
