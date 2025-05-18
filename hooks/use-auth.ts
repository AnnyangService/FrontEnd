import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { API_ENDPOINTS, PUBLIC_PATHS } from '@/lib/constants';

interface User {
  id: string;
  email: string;
  name: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.MY_INFO, {
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [pathname, router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    console.log('useAuth login called with:', { email, password });
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '로그인에 실패했습니다.');
      }

      await checkAuth();
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await fetch(API_ENDPOINTS.LOGOUT, {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
    router.push('/login');
  };

  const updateUser = async (id: string, updatedData: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.UPDATE_MEMBER(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();

    console.log("회원 수정 정보:", data);

    if (!response.ok || data.success === false) {
      throw new Error(data?.error?.message || '회원정보 수정에 실패했습니다.');
    }

    // 성공적으로 수정되었으면 사용자 정보 다시 갱신
    await checkAuth();
    return data.data; // 필요 시 수정된 데이터 반환
  } catch (error) {
    throw error;
  }
};

  return {
    user,
    loading,
    updateUser,
    login,
    logout,
    checkAuth,
  };
}
