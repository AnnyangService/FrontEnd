"use client"

import Header from "@/components/header"
import Link from "next/link"
import { Bell, HelpCircle, LogOut, FileText, User, Trash2 } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="pb-16">
      <Header title="설정" backUrl="/" />

      <div className="p-4 space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <Link href="/settings/notifications" className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <Bell className="w-6 h-6 mr-4" />
              <span>알림 설정</span>
            </div>
            <div className="text-gray-400">&gt;</div>
          </Link>

          <Link href="/settings/account" className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <User className="w-6 h-6 mr-4" />
              <span>계정 관리</span>
            </div>
            <div className="text-gray-400">&gt;</div>
          </Link>

          <Link href="/settings/help" className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <HelpCircle className="w-6 h-6 mr-4" />
              <span>도움말</span>
            </div>
            <div className="text-gray-400">&gt;</div>
          </Link>

          <Link href="/settings/terms" className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <FileText className="w-6 h-6 mr-4" />
              <span>약관 및 정책</span>
            </div>
            <div className="text-gray-400">&gt;</div>
          </Link>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Link href="/logout" className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <LogOut className="w-6 h-6 mr-4" />
              <span>로그아웃</span>
            </div>
            <div className="text-gray-400">&gt;</div>
          </Link>

          <Link href="/delete-account" className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Trash2 className="w-6 h-6 mr-4 text-red-500" />
              <span className="text-red-500">회원탈퇴</span>
            </div>
            <div className="text-gray-400">&gt;</div>
          </Link>
        </div>

        <div className="text-center text-gray-500 mt-8">
          <p>버전 1.0.0</p>
        </div>
      </div>
    </div>
  )
}

