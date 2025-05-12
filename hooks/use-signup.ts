import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/lib/constants';

export function useAuthSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data?.error?.message || '회원가입에 실패했습니다.');
      }

      // 회원가입 성공 후 로그인 페이지로 이동
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : '에러가 발생했습니다.');
      throw err; // SignupPage에서 에러 메시지 출력용
    } finally {
      setLoading(false);
    }
  };

  return {
    signup,
    loading,
    error,
  };
}
