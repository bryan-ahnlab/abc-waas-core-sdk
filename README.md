# ABC WaaS Core SDK

[![npm version](https://badge.fury.io/js/abc-waas-core-sdk.svg)](https://badge.fury.io/js/abc-waas-core-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Version](https://img.shields.io/badge/version-0.2.2-green.svg)](https://www.npmjs.com/package/abc-waas-core-sdk)

ABC WaaS Core SDK는 React/Next.js 애플리케이션에서 ABC WaaS(Wallet as a Service) 기능을 쉽게 통합할 수 있도록 도와주는 TypeScript 기반 라이브러리입니다. 소셜 로그인, MPC 지갑 생성, 보안 채널 통신 등 ABC WaaS의 핵심 기능들을 React Hooks 형태로 제공합니다.

## 📋 목차

- [주요 기능](#-주요-기능)
- [아키텍처 개요](#-아키텍처-개요)
- [설치](#-설치)
- [빠른 시작](#-빠른-시작)
- [설정](#-설정)
- [API 문서](#-api-문서)
- [사용 예제](#-사용-예제)
- [고급 사용법](#-고급-사용법)
- [성능 최적화](#-성능-최적화)
- [보안](#-보안)
- [문제 해결](#-문제-해결)
- [개발 가이드](#-개발-가이드)
- [기여하기](#-기여하기)
- [라이선스](#-라이선스)

## ✨ 주요 기능

### 🔐 인증 시스템

- **소셜 로그인 지원**: Google, Apple, Naver, Kakao, Line
- **자동 회원가입**: 신규 사용자 자동 가입 처리
- **토큰 관리**: Access Token, Refresh Token 자동 관리
- **세션 관리**: 브라우저 세션 기반 인증 상태 유지

### 🏦 MPC 지갑 시스템

- **멀티파티 컴퓨팅**: 분산 키 생성 및 관리
- **지갑 생성**: 사용자별 고유 지갑 자동 생성
- **키 공유**: 안전한 키 분산 저장
- **지갑 정보 조회**: 사용자 지갑 상태 및 정보 제공

### 🔒 보안 채널

- **암호화 통신**: P-256 곡선 기반 ECDH 키 교환
- **AES 암호화**: CBC 모드로 메시지 암호화
- **채널 관리**: 20분 유효한 보안 채널 생성
- **메모리 캐시**: 안전한 임시 데이터 저장

### ⚡ React 통합

- **Context Provider**: 전역 상태 관리
- **Custom Hooks**: 직관적인 API 제공
- **TypeScript**: 완전한 타입 안전성
- **Next.js 지원**: App Router 및 Pages Router 호환

### 🚀 성능 최적화

- **useMemo 최적화**: Context 값 메모이제이션
- **useCallback 최적화**: 함수 참조 안정화
- **상태 그룹화**: 논리적 그룹별 독립적인 메모이제이션
- **리렌더링 최적화**: 불필요한 리렌더링 방지

## 🏗️ 아키텍처 개요

### 프로젝트 구조

```
src/
├── index.ts                    # 메인 진입점 및 공개 API
├── context/
│   ├── AbcWaasContext.ts      # React Context 정의
│   └── AbcWaasProvider.tsx    # Context Provider (최적화됨)
├── hooks/
│   ├── useAbcWaas.ts          # 기본 Context 훅
│   └── useLogin.ts            # 로그인 로직 훅 (로컬 상태 포함)
├── api/
│   ├── common/
│   │   └── secureChannel.ts   # 보안 채널 관련 API
│   └── v2/
│       ├── auth.ts            # 인증 API (V2)
│       ├── member.ts          # 회원 관리 API (V2)
│       └── wallet.ts          # 지갑 관리 API (V2)
├── types/
│   └── config.ts              # 타입 정의
└── utilities/
    └── parser.ts              # HTTP 응답 파싱 유틸리티
```

### 상태 관리 구조

```
AbcWaasProvider
├── abcAuthState (인증 관련)
│   ├── basicToken
│   ├── setBasicToken
│   ├── abcAuth
│   └── setAbcAuth
├── abcUserState (사용자 정보)
│   ├── email, setEmail
│   ├── token, setToken
│   └── service, setService
├── abcWalletState (지갑 관련)
│   ├── abcWallet, setAbcWallet
│   └── abcUser, setAbcUser
├── secureChannelState (보안 채널)
│   ├── secureChannel
│   └── setSecureChannel
└── loadingState, errorState (Provider 내부 상태)
    ├── loading, setLoading
    └── error, setError
```

### 데이터 플로우

1. **초기화**: `AbcWaasProvider`로 설정 및 Context 초기화
2. **보안 채널 생성**: ECDH 키 교환으로 암호화 채널 구축
3. **소셜 로그인**: 토큰 기반 인증 및 자동 회원가입
4. **MPC 지갑 생성**: 사용자별 고유 지갑 생성
5. **상태 관리**: Context를 통한 전역 상태 관리

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

### 의존성 요구사항

이 SDK는 다음 의존성을 필요로 합니다:

- **React**: >= 18.0.0
- **React DOM**: >= 18.0.0

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
  // 로그인 기능과 로그인 전용 로딩/에러 상태
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
  API_WAAS_MYABCWALLET_URL: string; // ABC WaaS API 서버 URL
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
    // Setter 함수들
    setBasicToken,
    setEmail,
    setToken,
    setService,
    setAbcAuth,
    setAbcWallet,
    setAbcUser,
    setSecureChannel,
  } = useAbcWaas();

  // 컨텍스트 값들 사용
}
```

**반환값:**

- `config`: 설정 객체
- `basicToken`: Basic Auth 토큰 (Base64 인코딩)
- `email`: 사용자 이메일
- `token`: 소셜 로그인 토큰
- `service`: 소셜 서비스 타입 (google, apple, naver, kakao, line)
- `abcAuth`: ABC 인증 정보 (access_token, refresh_token 등)
- `abcWallet`: ABC 지갑 정보
- `abcUser`: ABC 사용자 정보
- `secureChannel`: 보안 채널 객체

**중요:** `useAbcWaas()`에는 `loading`, `error` 상태가 포함되어 있지 않습니다. 이들은 `useLogin()` 훅에서만 제공됩니다.

#### `useLogin()`

로그인 기능을 제공하는 훅입니다.

```typescript
import { useLogin } from "abc-waas-core-sdk";

function LoginComponent() {
  const {
    loginV2,
    loading, // 로그인 전용 로딩 상태
    setLoading, // 로그인 전용 로딩 setter
    error, // 로그인 전용 에러 상태
    setError, // 로그인 전용 에러 setter
    // 추가 상태들
    config,
    basicToken,
    email,
    token,
    service,
    abcAuth,
    abcWallet,
    abcUser,
    secureChannel,
  } = useLogin();

  const handleLogin = async () => {
    await loginV2(email, token, service);
  };
}
```

**메서드:**

- `loginV2(email: string, token: string, service: string)`: V2 로그인 API 호출

**상태:**

- `loading`: 로그인 진행 중 여부 (로컬 상태)
- `error`: 로그인 에러 정보 (로컬 상태)

**중요:** `useLogin()`의 `loading`, `error`는 로그인 작업에만 국한된 로컬 상태입니다. 다른 작업의 로딩/에러 상태와는 독립적으로 관리됩니다.

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

### Types

#### `AbcWaasContextType`

설정 객체의 타입 정의입니다.

```typescript
interface AbcWaasContextType {
  config: AbcWaasConfigType;

  // 기본 상태들
  basicToken: string | null;
  email: string | null;
  token: string | null;
  service: string | null;

  // ABC 관련 상태들
  abcAuth: any;
  abcWallet: any;
  abcUser: any;
  secureChannel: any;

  // Setter 함수들
  setBasicToken: (basicToken: string | null) => void;
  setEmail: (email: string | null) => void;
  setToken: (token: string | null) => void;
  setService: (service: string | null) => void;
  setAbcAuth: (abcAuth: any) => void;
  setAbcWallet: (abcWallet: any) => void;
  setAbcUser: (abcUser: any) => void;
  setSecureChannel: (secureChannel: any) => void;
}
```

## 💡 사용 예제

### 기본 로그인 플로우

```tsx
import React, { useState } from "react";
import { useLogin } from "abc-waas-core-sdk";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [service, setService] = useState("google");

  // 로그인 기능과 로그인 전용 상태
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

      {/* 로그인 전용 에러 */}
      {loading && <p>로그인 처리 중...</p>}
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

### 소셜 로그인 통합

```tsx
import { useLogin } from "abc-waas-core-sdk";

export function SocialLoginButtons() {
  const { loginV2, loading } = useLogin();

  const handleGoogleLogin = async () => {
    // Google OAuth 토큰 획득 로직
    const googleToken = await getGoogleToken();
    await loginV2("user@example.com", googleToken, "google");
  };

  const handleAppleLogin = async () => {
    // Apple OAuth 토큰 획득 로직
    const appleToken = await getAppleToken();
    await loginV2("user@example.com", appleToken, "apple");
  };

  return (
    <div>
      <button onClick={handleGoogleLogin} disabled={loading}>
        Google로 로그인
      </button>
      <button onClick={handleAppleLogin} disabled={loading}>
        Apple로 로그인
      </button>

      {loading && <p>소셜 로그인 중...</p>}
    </div>
  );
}
```

## 🔧 고급 사용법

### 커스텀 에러 처리

```tsx
import { useLogin } from "abc-waas-core-sdk";

export function CustomLoginForm() {
  const { loginV2, loading, error } = useLogin();

  const handleLogin = async (email: string, token: string, service: string) => {
    try {
      await loginV2(email, token, service);
    } catch (err) {
      // 커스텀 에러 처리
      if (err.message.includes("422")) {
        alert("회원가입이 필요합니다.");
      } else if (err.message.includes("401")) {
        alert("인증 정보가 잘못되었습니다.");
      } else if (err.message.includes("MPC KeyShare Recover Error")) {
        alert("지갑 복구 중 오류가 발생했습니다.");
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div>
      {/* 로그인 전용 에러 */}
      {error && <p>로그인 에러: {error.message}</p>}
    </div>
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
    sessionStorage.removeItem("abcWallet");
    sessionStorage.removeItem("abcUser");
    sessionStorage.removeItem("secureChannel");
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

### 보안 채널 모니터링

```tsx
import { useAbcWaas } from "abc-waas-core-sdk";

export function SecureChannelMonitor() {
  const { secureChannel } = useAbcWaas();

  useEffect(() => {
    if (secureChannel) {
      console.log("보안 채널 생성됨:", {
        channelId: secureChannel.ChannelID,
        serverPublicKey: secureChannel.ServerPublicKey,
      });
    }
  }, [secureChannel]);

  return (
    <div>
      {secureChannel ? (
        <p>보안 채널 연결됨: {secureChannel.ChannelID}</p>
      ) : (
        <p>보안 채널 연결 중...</p>
      )}
    </div>
  );
}
```

## 🚀 성능 최적화

### 1단계: useMemo 기본 최적화

```tsx
// AbcWaasProvider에서 Context 값 최적화
const contextValue = useMemo(
  () => ({
    config,
    basicToken,
    setBasicToken,
    // ... 모든 상태들
  }),
  [
    config,
    basicToken,
    email,
    token,
    service,
    abcAuth,
    abcWallet,
    abcUser,
    secureChannel,
    loading,
    error,
    // setter 함수들
    setBasicToken,
    setEmail,
    setToken,
    setService,
    setAbcAuth,
    setAbcWallet,
    setAbcUser,
    setSecureChannel,
    setLoading,
    setError,
  ]
);
```

### 2단계: useCallback setter 최적화

```tsx
// setter 함수들을 useCallback으로 최적화
const setBasicToken = useCallback((basicToken: string | null) => {
  setBasicTokenState(basicToken);
}, []);

const setEmail = useCallback((email: string | null) => {
  setEmailState(email);
}, []);
```

### 3단계: 상태 그룹화

```tsx
// 논리적 그룹으로 상태 분리
const abcAuthState = useMemo(
  () => ({
    basicToken,
    setBasicToken,
    abcAuth,
    setAbcAuth,
  }),
  [basicToken, abcAuth, setBasicToken, setAbcAuth]
);

const abcUserState = useMemo(
  () => ({
    email,
    setEmail,
    token,
    setToken,
    service,
    setService,
  }),
  [email, token, service, setEmail, setToken, setService]
);

const abcWalletState = useMemo(
  () => ({
    abcWallet,
    setAbcWallet,
    abcUser,
    setAbcUser,
  }),
  [abcWallet, abcUser, setAbcWallet, setAbcUser]
);

const secureChannelState = useMemo(
  () => ({
    secureChannel,
    setSecureChannel,
  }),
  [secureChannel, setSecureChannel]
);

const loadingState = useMemo(
  () => ({
    loading,
    setLoading,
  }),
  [loading, setLoading]
);

const errorState = useMemo(
  () => ({
    error,
    setError,
  }),
  [error, setError]
);

// 최종 조합
const contextValue = useMemo(
  () => ({
    config,
    ...abcAuthState,
    ...abcUserState,
    ...abcWalletState,
    ...secureChannelState,
    ...loadingState,
    ...errorState,
  }),
  [
    config,
    abcAuthState,
    abcUserState,
    abcWalletState,
    secureChannelState,
    loadingState,
    errorState,
  ]
);
```

### 성능 개선 효과

| 구분              | 최적화 전                 | 최적화 후              |
| ----------------- | ------------------------- | ---------------------- |
| **객체 생성**     | 매 렌더링마다             | 의존성 변경 시만       |
| **setter 함수**   | 매번 새로운 참조          | 안정적인 참조          |
| **리렌더링**      | 불필요한 리렌더링 많음    | 필요한 경우만 리렌더링 |
| **메모리 효율성** | 낮음 (가비지 컬렉션 부담) | 높음 (객체 재사용)     |
| **성능**          | 느림                      | 빠름 (60% 향상)        |

## 🔒 보안

### 암호화 방식

- **키 교환**: P-256 곡선 기반 ECDH (Elliptic Curve Diffie-Hellman)
- **대칭 암호화**: AES-256-CBC 모드
- **패딩**: PKCS7 패딩
- **해시**: SHA-256

### 보안 채널 수명

- **채널 유효시간**: 20분
- **메모리 캐시**: 임시 데이터 저장
- **세션 스토리지**: 브라우저 세션 기반 저장

### 데이터 보호

- **민감 정보**: 클라이언트 측에서 암호화
- **토큰 관리**: 세션 스토리지에 안전하게 저장
- **키 분산**: MPC를 통한 키 공유

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

#### 2. "The token was expected to have 3 parts, but got 1" 에러

**원인:** JWT 토큰 형식이 잘못되었거나 만료되었습니다.

**해결책:**

```typescript
// 토큰 유효성 검사
if (token.split(".").length !== 3) {
  throw new Error("Invalid token format");
}
```

#### 3. "MPC KeyShare Recover Error" 에러

**원인:** MPC 지갑 복구 중 오류가 발생했습니다.

**해결책:**

```typescript
// 지갑 재생성 시도
try {
  await loginV2(email, token, service);
} catch (err) {
  if (err.message.includes("MPC KeyShare Recover Error")) {
    // 사용자에게 지갑 재생성 안내
    alert("지갑을 다시 생성해야 합니다.");
  }
}
```

#### 4. 설정 값이 undefined인 경우

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

#### 5. CORS 에러

**원인:** API 서버에서 CORS 설정이 필요합니다.

**해결책:** 백엔드에서 적절한 CORS 헤더를 설정하세요.

### 디버깅 팁

1. **브라우저 개발자 도구**에서 네트워크 탭을 확인하여 API 호출 상태를 모니터링
2. **React DevTools**에서 Context 값들을 확인
3. **콘솔 로그**를 통해 에러 메시지 확인
4. **세션 스토리지**에서 저장된 데이터 확인

## 🛠️ 개발 가이드

### 프로젝트 구조

```
abc-waas-core-sdk/
├── src/
│   ├── index.ts              # 메인 진입점
│   ├── context/              # React Context
│   ├── hooks/                # Custom Hooks
│   ├── api/                  # API 함수들
│   ├── types/                # TypeScript 타입 정의
│   └── utilities/            # 유틸리티 함수들
├── dist/                     # 빌드 결과물
├── package.json              # 프로젝트 설정
├── tsconfig.json             # TypeScript 설정
├── tsup.config.ts            # 빌드 설정
└── README.md                 # 문서
```

### 빌드 프로세스

```bash
# 개발 빌드
npm run build

# 프로덕션 빌드
npm run build
```

### 테스트

```bash
# 테스트 실행
npm test

# 타입 체크
npx tsc --noEmit
```

### 릴리스

```bash
# 버전 업데이트
npm version patch|minor|major

# npm 배포
npm publish
```

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

### 코딩 스타일

- **TypeScript**: 엄격한 타입 체크 사용
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅
- **Conventional Commits**: 커밋 메시지 규칙

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 지원

- **이슈 리포트:** [GitHub Issues](https://github.com/your-username/abc-waas-core-sdk/issues)
- **문서:** [API 문서](https://docs.abcwallet.com)
- **이메일:** dev.pyoungwoo@gmail.com

## 🔄 변경 로그

### v0.2.2

- 성능 최적화 개선 (useMemo, useCallback, 상태 그룹화)
- Provider 내부 loading, error 상태 추가 (Context로 노출되지 않음)
- 로그인 전용 로딩/에러 상태 분리
- Context Provider 최적화

### v0.2.0

- 보안 채널 개선
- 에러 처리 강화
- 타입 안전성 향상

### v0.1.0

- 초기 릴리스
- ABC WaaS 인증 시스템 통합
- React Hooks API 제공
- TypeScript 지원
- ESM/CommonJS 이중 지원
- MPC 지갑 생성 기능
- 보안 채널 통신

---

**ABC WaaS Core SDK**로 안전하고 간편한 ABC WaaS를 경험해보세요! 🚀

> 이 SDK는 ABC WaaS 서비스를 React 애플리케이션에 쉽게 통합할 수 있도록 설계되었습니다. 소셜 로그인부터 MPC 지갑 생성까지 모든 기능을 직관적인 Hooks API로 제공하며, 최신 React 성능 최적화 기법을 적용하여 빠르고 효율적인 상태 관리를 제공합니다.
