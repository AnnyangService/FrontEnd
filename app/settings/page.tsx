"use client"

import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Link from "next/link"
import { Bell, HelpCircle, LogOut, FileText, User, Trash2 } from "lucide-react"
import { clearAccessToken } from "@/lib/token-memory"
import { AuthAPI } from "@/api/auth/auth.api"

export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await AuthAPI.logout();
      clearAccessToken();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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

          <Link href="/update_user" className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <User className="w-6 h-6 mr-4" />
              <span>계정 정보 수정</span>
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
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 border-b hover:bg-gray-50"
          >
            <div className="flex items-center">
              <LogOut className="w-6 h-6 mr-4" />
              <span>로그아웃</span>
            </div>
            <div className="text-gray-400">&gt;</div>
          </button>

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

