"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import BottomNavigation from "@/components/bottom-navigation";
import { AuthAPI } from "@/api/auth/auth.api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      console.log("Login with:", email, password);
      await AuthAPI.login(email, password);
      console.log("Login successful");
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white">
      <Header title="로그인" />

      <div className="flex-1 p-6 flex flex-col justify-start">
        <div className="space-y-6">
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          <div>
            <label className="block text-gray-700 mb-2">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white p-4 rounded-lg mt-4 active:bg-blue-600 transition duration-100"
          >
            로그인
          </button>
          <div className="flex justify-center gap-4 mt-4 text-sm text-gray-500">
            <a href="/find-id" className="hover:underline">아이디 찾기</a>
            <span>|</span>
            <a href="/find-password" className="hover:underline">비밀번호 찾기</a>
            <span>|</span>
            <a href="/sign_up" className="hover:underline">회원가입</a>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
