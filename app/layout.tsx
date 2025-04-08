import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import BottomNavigation from "@/components/bottom-navigation"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <main className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
          {children}
          <BottomNavigation />
        </main>
      </body>
    </html>
  )
}



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
