# Frontend

Next.js 기반 프론트엔드 웹 애플리케이션의 로컬 개발 환경 설정 가이드입니다.

## 개발 환경 설정

### 🛠️ 필수 요구사항
- Node.js 18.17 이상
- pnpm (권장) 또는 npm
- Git

### 🔧 권장 도구
- VS Code 또는 WebStorm
- Chrome DevTools
- React Developer Tools

## 로컬 실행 방법

### 1️⃣ Git 최신화
```sh
git fetch origin
git checkout main
git pull origin main
```

### 2️⃣ 의존성 설치
```sh
# pnpm 사용 (권장)
pnpm install

# npm 사용
npm install
```

### 3️⃣ 개발 서버 실행
```sh
# 개발 모드 실행
pnpm dev

# 또는
npm run dev
```

### 4️⃣ 프로덕션 빌드 및 실행
```sh
# 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

## 접속 정보

- **개발 서버**: http://localhost:3000
- **프로덕션 서버**: https://hi-meow.kro.kr/

## 기술 스택

### 🎯 Core
- **Framework**: Next.js 15.1.0
- **React**: 19.x
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 3.4.17

### 🧩 UI Components
- **Design System**: Radix UI
- **Icons**: Lucide React
- **Theming**: next-themes
- **Toast Notifications**: Sonner

### 📋 Form & Validation
- **Forms**: React Hook Form 7.54.1
- **Validation**: Zod 3.24.1
- **Resolvers**: @hookform/resolvers

### 📊 Data & Charts
- **Charts**: Recharts 2.15.0
- **HTTP Client**: Axios 1.9.0
- **Date Handling**: date-fns 4.1.0

### 🎨 UI Enhancements
- **Carousel**: Embla Carousel
- **Animations**: tailwindcss-animate
- **Responsive Panels**: react-resizable-panels
- **Mobile Drawer**: Vaul

## 프로젝트 구조

```
📁 FrontEnd/
├── 📄 next.config.mjs          # Next.js 설정
├── 📄 tailwind.config.ts       # Tailwind CSS 설정
├── 📄 tsconfig.json            # TypeScript 설정
├── 📁 app/                     # App Router (Next.js 13+)
│   ├── 📄 layout.tsx           # 루트 레이아웃
│   ├── 📄 page.tsx             # 홈페이지
│   ├── 📁 cat/                 # 고양이 관련 페이지
│   ├── 📁 chat/                # 채팅 페이지
│   ├── 📁 diagnosis/           # 진단 페이지
│   ├── 📁 login/               # 로그인 페이지
│   └── 📁 ...                  # 기타 페이지들
├── 📁 components/              # 재사용 컴포넌트
│   ├── 📁 ui/                  # UI 컴포넌트 (shadcn/ui)
│   └── 📄 ...                  # 커스텀 컴포넌트들
├── 📁 hooks/                   # 커스텀 React 훅
├── 📁 lib/                     # 유틸리티 및 설정
│   ├── 📁 types/               # TypeScript 타입 정의
│   └── 📁 utils/               # 유틸리티 함수들
├── 📁 api/                     # API 관련 로직
└── 📁 public/                  # 정적 파일들
```

## 개발 도구 설정

### VS Code 설정
권장 확장 프로그램:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- Auto Rename Tag

### 코드 품질 도구
```sh
# 린팅 실행
pnpm lint

# 코드 포맷팅 (Prettier 설정 시)
pnpm format
```

## 문제 해결

### 자주 발생하는 문제들

#### 🚫 포트 충돌 (3000 포트 사용 중)
```sh
# 포트 사용 프로세스 확인 및 종료
lsof -ti:3000 | xargs kill -9

# 다른 포트로 실행
pnpm dev -p 3001
```

#### 🚫 의존성 설치 실패
```sh
# node_modules 삭제 후 재설치
rm -rf node_modules pnpm-lock.yaml
pnpm install

# 캐시 정리
pnpm store prune
```

#### 🚫 빌드 실패
```sh
# Next.js 캐시 정리
rm -rf .next

# 전체 정리 후 재빌드
pnpm clean && pnpm build
```

#### 🚫 TypeScript 오류
```sh
# TypeScript 캐시 정리
npx tsc --build --clean

# 타입 체크 실행
pnpm type-check
```

#### 🚫 Tailwind CSS 스타일 적용 안됨
```sh
# Tailwind 설정 확인
npx tailwindcss --init

# PostCSS 설정 확인
cat postcss.config.mjs
```

### 디버깅 명령어
```sh
# 개발 서버 상세 로그
pnpm dev --debug

# 빌드 분석
pnpm build --analyze

# 의존성 트리 확인
pnpm list --depth=0

# 번들 크기 분석
npx @next/bundle-analyzer
```

## 환경 변수 설정

로컬 개발을 위한 환경 변수 파일을 생성하세요:

```env
# API 서버 URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## 관련 문서

### 개발 가이드
- 📝 [코딩 컨벤션](docs/CODING_CONEVENTIONS.md)
- 🔀 [커밋 규칙](docs/COMMIT_RULES.md)

### 프로젝트 문서  
- 📖 [이슈 추적 히스토리](docs/ISSUES.md)
