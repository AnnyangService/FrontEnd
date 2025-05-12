"use client"

import Header from "@/components/header";
import BottomNavigation from "@/components/bottom-navigation";
import { useAuthSignup } from "@/hooks/use-signup";
import { useRouter } from "next/navigation";
import { useState } from "react";




export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signup, loading} = useAuthSignup();
  const router = useRouter();
  const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
const [emailTouched, setEmailTouched] = useState(false);

  const handleSignup = async () => {
  try {
    console.log("Signup with:", name, email, password);
    await signup(name, email, password);
    router.push('/login');
  } catch (err) {
    const msg = err instanceof Error ? err.message : '회원가입에 실패했습니다.';

    if (msg === "Email already exists") {
      alert("이미 존재하는 아이디입니다."); 
    } else {
      setError(msg); 
    }
  }
}

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white">
      <Header title="회원가입" />

      <div className="flex-1 p-6 flex flex-col justify-start">
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              placeholder="이메일을 입력하세요"
              className={`w-full p-3 border rounded-lg transition-colors focus:outline-none focus:ring-0
                ${emailTouched && !isValidEmail(email) ? 'border-red-500' : ''} 
                ${emailTouched && isValidEmail(email) ? 'border-blue-500' : ''}`}
            />
            {emailTouched && !isValidEmail(email) && (
              <p className="text-red-500 text-sm mt-1">올바른 이메일 형식이 아닙니다.</p>
            )}
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
            onClick={handleSignup}
            className="w-full bg-green-500 text-white p-4 rounded-lg mt-4 hover:bg-green-600 active:bg-green-700 transition-colors"
          >
            회원가입
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}