"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/header";

export default function EditProfilePage() {
  const { user, updateUser, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("✅ 현재 user 상태:", user);

    const typedUser = user as any;
    const userData = typedUser?.data ?? typedUser;

    if (userData) {
      setEmail(userData.email || "");
      setName(userData.name || "");
    }
  }, [user]);

  const handleSubmit = async () => {
  console.log("✅ 회원정보 수정 시도");
  console.log("🧩 user 객체 전체:", JSON.stringify(user, null, 2));

  const typedUser = user as any;
  const userId = typedUser?.data?.id; // ✅ 여기만 바꿈
  console.log("📛 최종 userId:", userId);

  if (!userId) {
    console.log("⛔ userId 없음 (실제 user 구조 확인 필요)", user);
    setMessage("로그인 상태를 다시 확인해주세요.");
    return;
  }

  if (!email || !name || !password) {
    console.log("⛔ 누락된 입력값:", { email, name, password });
    setMessage("모든 항목을 입력해주세요.");
    return;
  }

  try {
    console.log("📡 updateUser 요청 시작");
    await updateUser(userId, { email, name, password });
    console.log("✅ 회원정보 수정 완료");
    setMessage("✅ 회원정보가 성공적으로 수정되었습니다.");
  } catch (error: any) {
    console.log("❌ 수정 실패", error);
    setMessage(`❌ 수정 실패: ${error.message}`);
  }
};


  if (loading) {
    return (
      <div className="p-4 text-center">
        <p>🔄 유저 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 text-center text-red-500">
        ❌ 유저 정보를 가져올 수 없습니다. 다시 로그인해보세요.
      </div>
    );
  }

  return (
    <div className="pb-16">
      <Header title="회원정보 수정" backUrl="/profile" />

      <div className="p-4 space-y-6 max-w-md mx-auto">
        {message && <p className="text-center text-sm text-red-500">{message}</p>}

        <div>
          <label className="block text-gray-700 mb-2">이메일</label>
          <input
            type="email"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">이름</label>
          <input
            type="text"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">비밀번호</label>
          <input
            type="password"
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-4 rounded-lg"
        >
          {loading ? "수정 중..." : "회원정보 수정"}
        </button>
      </div>
    </div>
  );
}
