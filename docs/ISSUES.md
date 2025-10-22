# 📋 프로젝트 이슈 트래킹 문서

이 문서는 프로젝트를 진행하며 마주쳤던 주요 기술적 문제들과 해결 과정을 기록합니다.

각 이슈는 문제 정의, 원인 분석, 해결책, 배운 점으로 구성되어 있습니다.

> 이 문서는 프로젝트 진행과 함께 지속적으로 업데이트됩니다.

<br>

## 이슈 #1: Next.js 배포 전략 및 렌더링 방식 결정

- **라벨**: `Architecture`, `Deployment`, `Performance`
- **핵심 요약**: AWS S3 + CloudFront 정적 호스팅 요구사항과 Next.js의 SSR 기본 설정 간의 충돌을 해결하고, 프로젝트 특성에 맞는 최적의 렌더링 방식을 선택했습니다.

### 1. 문제 상황 (Problem)

AWS S3 + CloudFront를 통한 정적 호스팅 배포를 계획했으나, Next.js의 기본 SSR/SSG 설정이 정적 호스팅 환경과 호환되지 않는 문제가 발생했습니다. 또한 프로젝트의 특성상 SEO가 중요하지 않음에도 불구하고 SSR의 복잡성을 감수해야 하는지에 대한 의문이 제기되었습니다.

### 2. 원인 분석 (Analysis)

**배포 환경과 렌더링 방식의 불일치:**
- S3 + CloudFront: 정적 파일만 서빙 가능 (서버사이드 실행 불가)
- Next.js 기본 설정: SSR/SSG가 활성화되어 서버 또는 빌드 타임 실행 필요

**기술 스택 선택의 딜레마:**
- Next.js vs Vite: 프로젝트 규모와 요구사항에 따른 적절한 선택 필요
- App Router vs Pages Router: 최신 버전의 기본 라우팅 방식 활용 여부

**렌더링 방식별 특징 비교:**
- **CSR (Client-Side Rendering)**:
  - 장점: 정적 호스팅 가능, 서버 부하 없음, SPA 같은 사용자 경험
  - 단점: 초기 로딩 속도 저하, SEO 취약
  
- **SSR (Server-Side Rendering)**:
  - 장점: 초기 로딩 속도 향상, SEO 최적화
  - 단점: 서버 리소스 필요, 배포 복잡성 증가

### 3. 최종 해결책 (Solution)

**1단계: 프로젝트 특성 분석**
- 내부 관리 도구로 SEO 최적화 불필요
- 사용자 경험과 개발 생산성 우선
- AWS 정적 호스팅 인프라 활용 필요

**2단계: Next.js CSR-only 설정**

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // 정적 파일 생성
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,       // S3에서 이미지 최적화 불가
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}
```

**3단계: App Router 활용**
Next.js 15의 App Router를 유지하면서 CSR 설정:

```tsx
// app/layout.tsx 및 모든 페이지 컴포넌트 상단
"use client"

// 이를 통해 App Router의 직관적인 폴더 구조를 유지하면서
// 클라이언트 사이드 렌더링 구현
```

**4단계: 배포 스크립트 최적화**

```json
// package.json (실제 프로젝트 반영)
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "packageManager": "pnpm@9.14.4"
}
```

**Next.js 설정 (실제 설정 반영)**

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig;
```

### 4. 배운 점

**아키텍처 결정의 중요성:**
프레임워크의 기본 설정을 맹목적으로 따르기보다는, 프로젝트의 실제 요구사항(SEO 필요성, 배포 환경, 사용자 특성)을 정확히 파악하고 이에 맞는 설정을 선택하는 것이 중요함을 깨달았습니다.

**기술 스택 선택 기준:**
- Vite: 순수 SPA 구축 시 더 가볍고 빠름
- Next.js: 라우팅, 이미지 최적화, 개발 편의성 제공으로 생산성 향상

**하이브리드 접근법의 효과:**
Next.js의 강력한 DX(Developer Experience)를 유지하면서도 정적 호스팅의 이점을 누릴 수 있는 CSR-only 설정을 통해 두 가지 장점을 모두 확보할 수 있었습니다.

<br>

## 이슈 #2: API 통신 및 상태 관리 아키텍처

- **라벨**: `API`, `State`, `Architecture`
- **핵심 요약**: 복잡한 API 호출 로직과 상태 관리를 체계화하여 코드 재사용성과 유지보수성을 향상시켰습니다.

### 1. 문제 상황 (Problem)

컴포넌트별로 분산된 API 호출 로직으로 인해 중복 코드가 발생하고, 에러 처리와 로딩 상태 관리가 일관성 없이 구현되어 유지보수가 어려워졌습니다.

### 2. 원인 분석 (Analysis)

**API 로직 분산:**
- 각 컴포넌트에서 개별적으로 fetch 로직 구현
- 에러 처리 방식의 불일치
- 로딩 상태 관리의 중복

**상태 관리 복잡성:**
- 전역 상태와 로컬 상태의 경계 모호
- 비동기 상태 처리의 일관성 부족

### 3. 최종 해결책 (Solution)

**1단계: API 클래스 구조화**

```typescript
// api/auth/auth.api.ts
export class AuthAPI {
  private static readonly BASE_URL = '/api/auth';

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${this.BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    return response.json();
  }

  static async me(): Promise<User> {
    // 구현
  }
}
```

**2단계: 커스텀 훅 패턴**

```typescript
// hooks/use-auth.ts
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await AuthAPI.login(credentials);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, login, isAuthenticated: !!user };
}
```

**3단계: 전역 상태 관리**

```typescript
// Context API 활용한 인증 상태 관리
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 4. 배운 점

**관심사의 분리:**
API 로직, 상태 관리, UI 컴포넌트를 명확히 분리하여 각각의 역할과 책임을 명확히 하는 것이 코드 품질 향상에 중요함을 깨달았습니다.

**재사용 가능한 패턴:**
커스텀 훅을 통한 로직 추상화로 컴포넌트 간 코드 재사용성을 크게 향상시킬 수 있었습니다.
