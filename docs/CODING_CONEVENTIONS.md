# 📝 코딩 컨벤션 (Coding Conventions)

Next.js + TypeScript + Tailwind CSS 기반 프로젝트의 코딩 표준 및 가이드라인입니다.

## 📋 목차
- [파일 및 폴더 네이밍](#파일-및-폴더-네이밍)
- [TypeScript 컨벤션](#typescript-컨벤션)
- [React 컴포넌트 컨벤션](#react-컴포넌트-컨벤션)
- [스타일링 컨벤션](#스타일링-컨벤션)
- [API 및 훅 컨벤션](#api-및-훅-컨벤션)
- [Import/Export 컨벤션](#importexport-컨벤션)
- [주석 및 문서화](#주석-및-문서화)
- [코드 품질 도구](#코드-품질-도구)

---

## 📁 파일 및 폴더 네이밍

### 폴더명
- **kebab-case** 사용
- 소문자로 작성
- 하이픈(`-`)으로 단어 구분

```
✅ Good
pages/user-profile/
components/auth-guard/
utils/date-formatter/

❌ Bad
pages/UserProfile/
components/authGuard/
utils/dateFormatter/
```

### 파일명
- **용도별 네이밍 규칙**

```typescript
// 페이지 컴포넌트: page.tsx
app/login/page.tsx
app/cat/register/page.tsx

// 레이아웃 컴포넌트: layout.tsx
app/layout.tsx
app/dashboard/layout.tsx

// UI 컴포넌트: kebab-case.tsx
components/ui/button.tsx
components/ui/input-field.tsx

// 일반 컴포넌트: kebab-case.tsx
components/auth-guard.tsx
components/bottom-navigation.tsx

// 커스텀 훅: use-kebab-case.ts
hooks/use-auth.ts
hooks/use-cat-info.ts

// API 파일: 도메인.api.ts
api/auth/auth.api.ts
api/cat/cat.api.ts

// 타입 정의: 도메인.ts
lib/types/cat.ts
lib/types/diagnosis.ts

// 유틸리티: kebab-case.ts
lib/utils/date.ts
lib/utils/validation.ts
```

---

## 🔷 TypeScript 컨벤션

### 타입 및 인터페이스

```typescript
// ✅ 인터페이스는 PascalCase
interface User {
  id: string;
  email: string;
  name: string;
}

// ✅ 타입 별칭도 PascalCase
type UserRole = 'admin' | 'user' | 'guest';

// ✅ 제네릭은 T, U, V 또는 의미있는 이름
interface ApiResponse<TData> {
  data: TData;
  success: boolean;
  message?: string;
}

// ✅ Props 타입은 컴포넌트명 + Props
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

### 변수 및 함수

```typescript
// ✅ 변수는 camelCase
const userName = 'john';
const isLoggedIn = true;
const userPreferences = {};

// ✅ 함수는 camelCase, 동사로 시작
function getUserProfile() {}
function validateEmail() {}
function formatDate() {}

// ✅ 상수는 UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;
```

### 타입 정의 위치

```typescript
// ✅ 컴포넌트 내부에서만 사용하는 타입
function UserCard() {
  type UserStatus = 'online' | 'offline' | 'away';
  // ...
}

// ✅ 여러 곳에서 사용하는 타입은 별도 파일
// lib/types/user.ts
export interface User {
  id: string;
  email: string;
  status: UserStatus;
}
```

---

## ⚛️ React 컴포넌트 컨벤션

### 컴포넌트 구조

```typescript
// ✅ 컴포넌트 파일 구조 예시
"use client"; // 필요한 경우에만

import React from "react"; // 필요한 경우
import { useState, useEffect } from "react";
import Link from "next/link";

// 외부 라이브러리
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 내부 컴포넌트 및 훅
import { useAuth } from "@/hooks/use-auth";

// 타입 정의
interface UserProfileProps {
  userId: string;
  className?: string;
}

// 컴포넌트 정의
export function UserProfile({ userId, className }: UserProfileProps) {
  // 상태 관리
  const [loading, setLoading] = useState(false);
  
  // 커스텀 훅
  const { user, logout } = useAuth();
  
  // 이벤트 핸들러
  const handleLogout = () => {
    logout();
  };
  
  // 렌더링
  return (
    <div className={cn("user-profile", className)}>
      {/* JSX 내용 */}
    </div>
  );
}
```

### 컴포넌트 네이밍

```typescript
// ✅ 컴포넌트는 PascalCase
export function UserProfile() {}
export function AuthGuard() {}
export function BottomNavigation() {}

// ✅ 페이지 컴포넌트는 기본 export
export default function LoginPage() {}
export default function HomePage() {}
```

### Props 패턴

```typescript
// ✅ Props 구조분해할당 사용
function Button({ variant, size, children, ...props }: ButtonProps) {
  return <button {...props}>{children}</button>;
}

// ✅ 기본값 설정
function Card({ 
  title, 
  description, 
  variant = "default" 
}: CardProps) {
  // ...
}

// ✅ children prop 타입 지정
interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}
```

---

## 🎨 스타일링 컨벤션

### Tailwind CSS 클래스 순서

```typescript
// ✅ 클래스 순서: 레이아웃 → 스타일링 → 상태
<div className="
  flex items-center justify-between p-4 
  bg-white border border-gray-200 rounded-lg shadow-sm
  hover:shadow-md transition-shadow
">
```

### 조건부 스타일링

```typescript
// ✅ cn 유틸리티 사용
import { cn } from "@/lib/utils";

<button 
  className={cn(
    "px-4 py-2 rounded-md font-medium",
    variant === "primary" && "bg-blue-500 text-white",
    variant === "secondary" && "bg-gray-200 text-gray-900",
    disabled && "opacity-50 cursor-not-allowed"
  )}
>
```

### CSS 변수 활용

```typescript
// ✅ Tailwind 설정의 CSS 변수 사용
<div className="bg-background text-foreground">
<div className="bg-primary text-primary-foreground">
```

---

## 🔌 API 및 훅 컨벤션

### API 클래스 구조

```typescript
// api/auth/auth.api.ts
export class AuthAPI {
  private static readonly BASE_URL = '/api/auth';

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // 구현
  }

  static async logout(): Promise<void> {
    // 구현
  }

  static async me(): Promise<User> {
    // 구현
  }
}
```

### 커스텀 훅 패턴

```typescript
// hooks/use-auth.ts
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 메서드들
  const login = useCallback(async (credentials: LoginCredentials) => {
    // 구현
  }, []);

  const logout = useCallback(() => {
    // 구현
  }, []);

  // 반환값
  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
```

### API 응답 타입

```typescript
// api/api.types.ts
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  error: string;
  statusCode: number;
  message?: string;
}
```

---

## 📦 Import/Export 컨벤션

### Import 순서

```typescript
// 1. React 관련
import React from "react";
import { useState, useEffect } from "react";

// 2. Next.js 관련
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

// 3. 외부 라이브러리 (알파벳 순)
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, Settings } from "lucide-react";

// 4. 내부 모듈 (절대 경로 사용)
import { useAuth } from "@/hooks/use-auth";
import { AuthAPI } from "@/api/auth/auth.api";
import { User } from "@/lib/types/user";

// 5. 상대 경로 import (같은 디렉토리)
import { UserCard } from "./user-card";
```

### Export 패턴

```typescript
// ✅ Named export 사용 (재사용 컴포넌트)
export function Button() {}
export function Card() {}

// ✅ Default export 사용 (페이지 컴포넌트)
export default function HomePage() {}

// ✅ 타입과 함께 export
export type { ButtonProps } from "./button";
export { Button } from "./button";
```

---

## 📖 주석 및 문서화

### JSDoc 주석

```typescript
/**
 * 사용자 인증을 처리하는 커스텀 훅
 * @returns 사용자 정보, 로딩 상태, 인증 메서드들
 */
export function useAuth() {
  // ...
}

/**
 * API 응답을 처리하는 유틸리티 함수
 * @param response - Fetch API 응답 객체
 * @returns 파싱된 JSON 데이터
 * @throws API 오류 시 Error 객체
 */
async function handleApiResponse<T>(response: Response): Promise<T> {
  // ...
}
```

### 인라인 주석

```typescript
// ✅ 복잡한 로직에 대한 설명
const processedData = data
  .filter(item => item.isActive) // 활성 상태인 항목만 필터링
  .map(item => ({
    ...item,
    displayName: formatName(item.name) // 사용자 친화적 이름으로 변환
  }));

// ✅ TODO 주석
// TODO: API 응답 캐싱 로직 추가
// FIXME: 메모리 누수 가능성 있음
```

---

## 🛠️ 코드 품질 도구

### ESLint 설정

```json
// .eslintrc.json (권장 설정)
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### Prettier 설정

```json
// .prettierrc (권장 설정)
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### 개발 도구 설정

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

---

## 🚀 성능 및 최적화

### 컴포넌트 최적화

```typescript
// ✅ React.memo 사용
export const UserCard = React.memo(function UserCard({ user }: UserCardProps) {
  return <div>{user.name}</div>;
});

// ✅ useMemo, useCallback 적절히 사용
function UserList({ users }: UserListProps) {
  const sortedUsers = useMemo(
    () => users.sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  );

  const handleUserClick = useCallback((userId: string) => {
    // 핸들러 로직
  }, []);

  return (
    // JSX
  );
}
```

### 동적 import

```typescript
// ✅ 페이지 컴포넌트 동적 로딩
const AdminPanel = dynamic(() => import("@/components/admin-panel"), {
  loading: () => <div>Loading...</div>,
});

// ✅ 라이브러리 동적 로딩
const handleChartRender = async () => {
  const { Chart } = await import("chart.js");
  // 차트 렌더링 로직
};
```

---

## ✅ 체크리스트

새로운 코드 작성 시 확인할 항목들:

- [ ] 파일명이 컨벤션에 맞는가?
- [ ] TypeScript 타입이 명확하게 정의되었는가?
- [ ] Import 순서가 올바른가?
- [ ] 컴포넌트 구조가 일관적인가?
- [ ] Tailwind 클래스 순서가 올바른가?
- [ ] 불필요한 주석이 없는가?
- [ ] ESLint 규칙을 위반하지 않는가?
- [ ] 성능 최적화를 고려했는가?

---

## 📚 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [React 베스트 프랙티스](https://react.dev/learn)
- [shadcn/ui 컴포넌트 가이드](https://ui.shadcn.com/)

---

**📝 이 컨벤션은 프로젝트와 함께 발전합니다. 개선사항이 있다면 언제든 제안해주세요!**