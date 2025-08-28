# ABC WaaS Core SDK

[![npm version](https://badge.fury.io/js/abc-waas-core-sdk.svg)](https://badge.fury.io/js/abc-waas-core-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

ABC WaaS Core SDK는 React/Next.js 애플리케이션에서 ABC Wallet 인증 및 서비스를 쉽게 통합할 수 있도록 도와주는 TypeScript 기반 라이브러리입니다.

## 📋 목차

- [주요 기능](#-주요-기능)
- [설치](#-설치)
- [빠른 시작](#-빠른-시작)
- [설정](#-설정)
- [API 문서](#-api-문서)
- [예제](#-예제)
- [고급 사용법](#-고급-사용법)
- [문제 해결](#-문제-해결)
- [기여하기](#-기여하기)
- [라이선스](#-라이선스)

## ✨ 주요 기능

- 🔐 **ABC Wallet 인증 시스템** - 안전한 로그인 및 회원가입
- 🏦 **MPC 지갑 관리** - 멀티파티 컴퓨팅 기반 지갑 생성 및 관리
- 🔒 **보안 채널** - 암호화된 통신 채널 제공
- ⚡ **React Hooks** - 직관적인 React 훅 기반 API
- 📱 **Next.js 지원** - App Router 및 Pages Router 모두 지원
- 🎯 **TypeScript** - 완전한 타입 안전성 제공
- 🌐 **범용 호환성** - ESM과 CommonJS 모두 지원

## 📦 설치

### npm 사용

```bash
npm install abc-waas-core-sdk
```

### yarn 사용

```bash
yarn add abc-waas-core-sdk
```

### pnpm 사용

```bash
pnpm add abc-waas-core-sdk
```

## 🚀 빠른 시작

### 1. Provider 설정

먼저 애플리케이션의 최상위 레벨에서 `AbcWaasProvider`를 설정합니다:

```tsx
// app/layout.tsx (Next.js App Router)
import { AbcWaasProvider } from "abc-waas-core-sdk";

const config = {
  API_WAAS_MYABCWALLET_URL: "https://api.abcwallet.com",
  MW_MYABCWALLET_URL: "https://mw.abcwallet.com",
  CLIENT_ID: "your-client-id",
  CLIENT_SECRET: "your-client-secret",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <AbcWaasProvider config={config}>{children}</AbcWaasProvider>
      </body>
    </html>
  );
}
```

### 2. 로그인 구현

컴포넌트에서 로그인 훅을 사용합니다:

```tsx
// components/LoginForm.tsx
import { useLogin } from "abc-waas-core-sdk";

export function LoginForm() {
  const { loginV2, loading, error } = useLogin();

  const handleLogin = async (email: string, token: string, service: string) => {
    try {
      await loginV2(email, token, service);
      console.log("로그인 성공!");
    } catch (err) {
      console.error("로그인 실패:", err);
    }
  };

  return (
    <div>
      {loading && <p>로그인 중...</p>}
      {error && <p>에러: {error.message}</p>}
      {/* 로그인 폼 UI */}
    </div>
  );
}
```

## ⚙️ 설정

### 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 설정하세요:

```env
NEXT_PUBLIC_API_WAAS_MYABCWALLET_URL=https://api.abcwallet.com
NEXT_PUBLIC_MW_MYABCWALLET_URL=https://mw.abcwallet.com
NEXT_PUBLIC_CLIENT_ID=your-client-id
NEXT_PUBLIC_CLIENT_SECRET=your-client-secret
```

### 설정 객체 타입

```typescript
interface AbcWaasConfigType {
  API_WAAS_MYABCWALLET_URL: string; // ABC Wallet API 서버 URL
  MW_MYABCWALLET_URL: string; // Middleware 서버 URL
  CLIENT_ID: string; // 클라이언트 ID
  CLIENT_SECRET: string; // 클라이언트 시크릿
}
```

## 📚 API 문서

### Hooks

#### `useAbcWaas()`

ABC WaaS 컨텍스트에 접근하는 기본 훅입니다.

```typescript
import { useAbcWaas } from "abc-waas-core-sdk";

function MyComponent() {
  const {
    config,
    basicToken,
    email,
    token,
    service,
    abcAuth,
    abcWallet,
    abcUser,
    secureChannel,
    // ... setter 함수들
  } = useAbcWaas();

  // 컨텍스트 값들 사용
}
```

**반환값:**

- `config`: 설정 객체
- `basicToken`: 기본 인증 토큰
- `email`: 사용자 이메일
- `token`: 사용자 토큰
- `service`: 서비스 식별자
- `abcAuth`: ABC 인증 정보
- `abcWallet`: ABC 지갑 정보
- `abcUser`: ABC 사용자 정보
- `secureChannel`: 보안 채널 객체

#### `useLogin()`

로그인 기능을 제공하는 훅입니다.

```typescript
import { useLogin } from "abc-waas-core-sdk";

function LoginComponent() {
  const { loginV2, loading, error } = useLogin();

  const handleLogin = async () => {
    await loginV2(email, token, service);
  };
}
```

**메서드:**

- `loginV2(email: string, token: string, service: string)`: V2 로그인 API 호출

**상태:**

- `loading`: 로그인 진행 중 여부
- `error`: 에러 정보

### Context

#### `AbcWaasProvider`

ABC WaaS 서비스를 위한 React Context Provider입니다.

```tsx
import { AbcWaasProvider } from "abc-waas-core-sdk";

<AbcWaasProvider config={config}>{children}</AbcWaasProvider>;
```

**Props:**

- `config`: ABC WaaS 설정 객체
- `children`: 자식 컴포넌트들

## 💡 예제

### 기본 로그인 플로우

```tsx
import React, { useState } from "react";
import { useLogin } from "abc-waas-core-sdk";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [service, setService] = useState("google");

  const { loginV2, loading, error } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await loginV2(email, token, service);
      alert("로그인 성공!");
    } catch (err) {
      console.error("로그인 실패:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>이메일:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>토큰:</label>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
      </div>

      <div>
        <label>서비스:</label>
        <select value={service} onChange={(e) => setService(e.target.value)}>
          <option value="google">Google</option>
          <option value="apple">Apple</option>
          <option value="naver">Naver</option>
          <option value="kakao">Kakao</option>
          <option value="line">Line</option>
        </select>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "로그인 중..." : "로그인"}
      </button>

      {error && <p style={{ color: "red" }}>에러: {error.message}</p>}
    </form>
  );
}
```

### 지갑 정보 조회

```tsx
import React, { useEffect, useState } from "react";
import { useAbcWaas } from "abc-waas-core-sdk";

export function WalletInfo() {
  const { abcWallet, abcUser } = useAbcWaas();
  const [walletData, setWalletData] = useState(null);

  useEffect(() => {
    if (abcWallet) {
      setWalletData(abcWallet);
    }
  }, [abcWallet]);

  if (!walletData) {
    return <p>지갑 정보를 불러오는 중...</p>;
  }

  return (
    <div>
      <h2>지갑 정보</h2>
      <pre>{JSON.stringify(walletData, null, 2)}</pre>
    </div>
  );
}
```

### Next.js App Router 예제

```tsx
// app/page.tsx
"use client";

import { useAbcWaas } from "abc-waas-core-sdk";
import { LoginPage } from "@/components/LoginPage";

export default function HomePage() {
  const { abcAuth } = useAbcWaas();

  if (!abcAuth) {
    return <LoginPage />;
  }

  return (
    <div>
      <h1>환영합니다!</h1>
      <p>로그인되었습니다.</p>
    </div>
  );
}
```

## 🔧 고급 사용법

### 커스텀 에러 처리

```tsx
import { useLogin } from 'abc-waas-core-sdk';

export function CustomLoginForm() {
  const { loginV2, loading, error } = useLogin();

  const handleLogin = async (email: string, token: string, service: string) => {
    try {
      await loginV2(email, token, service);
    } catch (err) {
      // 커스텀 에러 처리
      if (err.message.includes('422')) {
        alert('회원가입이 필요합니다.');
      } else if (err.message.includes('401')) {
        alert('인증 정보가 잘못되었습니다.');
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    // 폼 UI
  );
}
```

### 세션 관리

```tsx
import { useAbcWaas } from "abc-waas-core-sdk";

export function SessionManager() {
  const { abcAuth, setAbcAuth } = useAbcWaas();

  const logout = () => {
    setAbcAuth(null);
    sessionStorage.removeItem("abcAuth");
  };

  const checkSession = () => {
    const storedAuth = sessionStorage.getItem("abcAuth");
    if (storedAuth && !abcAuth) {
      setAbcAuth(JSON.parse(storedAuth));
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <div>
      {abcAuth ? (
        <button onClick={logout}>로그아웃</button>
      ) : (
        <p>로그인이 필요합니다.</p>
      )}
    </div>
  );
}
```

## 🐛 문제 해결

### 일반적인 문제들

#### 1. "Not found AbcWaasContext" 에러

**원인:** 컴포넌트가 `AbcWaasProvider` 외부에서 훅을 사용하고 있습니다.

**해결책:**

```tsx
// 올바른 사용법
<AbcWaasProvider config={config}>
  <MyComponent /> {/* 여기서 훅 사용 가능 */}
</AbcWaasProvider>
```

#### 2. 설정 값이 undefined인 경우

**원인:** 환경 변수가 제대로 로드되지 않았습니다.

**해결책:**

```typescript
// 환경 변수 확인
console.log(process.env.NEXT_PUBLIC_CLIENT_ID);

// 기본값 설정
const config = {
  CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID || "default-id",
  // ...
};
```

#### 3. CORS 에러

**원인:** API 서버에서 CORS 설정이 필요합니다.

**해결책:** 백엔드에서 적절한 CORS 헤더를 설정하세요.

### 디버깅 팁

1. **브라우저 개발자 도구**에서 네트워크 탭을 확인하여 API 호출 상태를 모니터링
2. **React DevTools**에서 Context 값들을 확인
3. **콘솔 로그**를 통해 에러 메시지 확인

## 🤝 기여하기

프로젝트에 기여하고 싶으시다면 다음 단계를 따라주세요:

1. 이 저장소를 포크합니다
2. 새로운 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

### 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/your-username/abc-waas-core-sdk.git

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 테스트 실행
npm test
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 지원

- **이슈 리포트:** [GitHub Issues](https://github.com/your-username/abc-waas-core-sdk/issues)
- **문서:** [API 문서](https://docs.abcwallet.com)
- **이메일:** dev.pyoungwoo@gmail.com

## 🔄 변경 로그

### v0.1.1

- 초기 릴리스
- ABC Wallet 인증 시스템 통합
- React Hooks API 제공
- TypeScript 지원
- ESM/CommonJS 이중 지원

---

**ABC WaaS Core SDK**로 안전하고 간편한 ABC WaaS 통합을 경험해보세요! 🚀
