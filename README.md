# ABC WaaS Core SDK

ABC WaaS (Wallet as a Service) Core SDK는 React/Next.js 애플리케이션에서 ABC(안랩블록체인컴퍼니)의 지갑 서비스를 쉽게 통합할 수 있도록 도와주는 TypeScript 라이브러리입니다.

## 📦 패키지 정보

- **패키지명**: `abc-waas-core-sdk`
- **현재 버전**: `0.2.12`
- **라이선스**: MIT
- **작성자**: dev.pyoungwoo@gmail.com

## ✨ 주요 기능

- 🔐 **P-256 ECDH 기반 보안 채널**: 안전한 클라이언트-서버 통신
- 🔑 **OAuth2 스타일 토큰 인증**: 표준 인증 프로토콜 지원
- 👤 **자동 회원가입/로그인**: 사용자 경험 최적화
- 💼 **MPC 지갑 관리**: Multi-Party Computation 기반 지갑 생성
- 🎯 **React Hooks 기반**: 직관적인 상태 관리
- 📱 **세션 자동 복원**: 페이지 새로고침 후에도 로그인 상태 유지
- 🛡️ **완전한 TypeScript 지원**: 타입 안전성 보장

## 🚀 설치

```bash
npm install abc-waas-core-sdk
```

## 📋 시스템 요구사항

### 최소 요구사항
- **Node.js**: 14.0.0 이상
- **React**: 18.0.0 이상
- **TypeScript**: 4.5.0 이상 (선택사항)

### 지원 환경
- ✅ **브라우저**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- ✅ **React**: 18.0.0+
- ✅ **Next.js**: 12.0.0+
- ✅ **Node.js**: 14.0.0+ (서버사이드 렌더링)

### 브라우저 호환성
- **Web Crypto API**: 보안 채널 생성에 필요
- **SessionStorage**: 세션 관리에 필요
- **Fetch API**: HTTP 요청에 필요
- **ES2017+**: 최신 JavaScript 기능 사용

## ⚙️ 설정

### 1. 환경 변수 설정

SDK를 사용하기 위해 다음 환경 변수들이 필요합니다:

| 환경 변수 | 타입 | 설명 | 예시 |
|-----------|------|------|------|
| `API_WAAS_MYABCWALLET_URL` | string | ABC WaaS API 서버 URL | `https://api.abcwallet.com` |
| `MW_MYABCWALLET_URL` | string | MyABCWallet 서비스 URL | `https://wallet.abcwallet.com` |
| `CLIENT_ID` | string | 클라이언트 ID (ABC에서 발급) | `abc_client_12345` |
| `CLIENT_SECRET` | string | 클라이언트 시크릿 (ABC에서 발급) | `secret_abcdef123456` |

### 2. 환경 변수 설정 방법

#### React 애플리케이션
```bash
# .env.local
REACT_APP_API_WAAS_MYABCWALLET_URL=https://api.abcwallet.com
REACT_APP_MW_MYABCWALLET_URL=https://wallet.abcwallet.com
REACT_APP_CLIENT_ID=abc_client_12345
REACT_APP_CLIENT_SECRET=secret_abcdef123456
```

#### Next.js 애플리케이션
```bash
# .env.local
NEXT_PUBLIC_API_WAAS_MYABCWALLET_URL=https://api.abcwallet.com
NEXT_PUBLIC_MW_MYABCWALLET_URL=https://wallet.abcwallet.com
NEXT_PUBLIC_CLIENT_ID=abc_client_12345
NEXT_PUBLIC_CLIENT_SECRET=secret_abcdef123456
```

### 3. AbcWaasProvider 설정

애플리케이션의 최상위에 `AbcWaasProvider`를 설정합니다.

```tsx
import { AbcWaasProvider } from "abc-waas-core-sdk";

const config = {
  API_WAAS_MYABCWALLET_URL: process.env.REACT_APP_API_WAAS_MYABCWALLET_URL!,
  MW_MYABCWALLET_URL: process.env.REACT_APP_MW_MYABCWALLET_URL!,
  CLIENT_ID: process.env.REACT_APP_CLIENT_ID!,
  CLIENT_SECRET: process.env.REACT_APP_CLIENT_SECRET!,
};

function App() {
  return (
    <AbcWaasProvider config={config}>
      <YourApp />
    </AbcWaasProvider>
  );
}
```

## 🎯 사용법

### 1. 기본 설정

```tsx
// App.tsx
import React from "react";
import { AbcWaasProvider } from "abc-waas-core-sdk";

const config = {
  API_WAAS_MYABCWALLET_URL: process.env.REACT_APP_API_WAAS_MYABCWALLET_URL!,
  MW_MYABCWALLET_URL: process.env.REACT_APP_MW_MYABCWALLET_URL!,
  CLIENT_ID: process.env.REACT_APP_CLIENT_ID!,
  CLIENT_SECRET: process.env.REACT_APP_CLIENT_SECRET!,
};

function App() {
  return (
    <AbcWaasProvider config={config}>
      <MainApp />
    </AbcWaasProvider>
  );
}

export default App;
```

### 2. 로그인 컴포넌트

```tsx
// LoginComponent.tsx
import React, { useState } from "react";
import { useLogin } from "abc-waas-core-sdk";

function LoginComponent() {
  const { loginV2, loginInfo } = useLogin();
  const [formData, setFormData] = useState({
    email: "",
    token: "",
    service: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await loginV2(formData.email, formData.token, formData.service);
      console.log("로그인 성공!");
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">이메일:</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label htmlFor="token">토큰:</label>
        <input
          id="token"
          name="token"
          type="text"
          value={formData.token}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label htmlFor="service">서비스:</label>
        <input
          id="service"
          name="service"
          type="text"
          value={formData.service}
          onChange={handleChange}
          required
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loginInfo.loading}
      >
        {loginInfo.loading ? "로그인 중..." : "로그인"}
      </button>
      
      {loginInfo.error && (
        <div style={{ color: "red" }}>
          에러: {loginInfo.error.message}
        </div>
      )}
      
      {loginInfo.status === "SUCCESS" && (
        <div style={{ color: "green" }}>
          로그인 성공!
        </div>
      )}
    </form>
  );
}

export default LoginComponent;
```

### 3. 사용자 정보 컴포넌트

```tsx
// UserInfoComponent.tsx
import React from "react";
import { useAbcWaas, useLogout } from "abc-waas-core-sdk";

function UserInfoComponent() {
  const { email, abcUser, loginInfo } = useAbcWaas();
  const { logoutV2, logoutInfo } = useLogout();

  const handleLogout = async () => {
    try {
      await logoutV2();
      console.log("로그아웃 성공!");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  if (loginInfo.status !== "SUCCESS") {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <div>
      <h2>사용자 정보</h2>
      <p><strong>이메일:</strong> {email}</p>
      
      {abcUser && (
        <div>
          <h3>지갑 정보</h3>
          <pre>{JSON.stringify(abcUser, null, 2)}</pre>
        </div>
      )}
      
      <button 
        onClick={handleLogout}
        disabled={logoutInfo.loading}
      >
        {logoutInfo.loading ? "로그아웃 중..." : "로그아웃"}
      </button>
      
      {logoutInfo.error && (
        <div style={{ color: "red" }}>
          로그아웃 에러: {logoutInfo.error.message}
        </div>
      )}
    </div>
  );
}

export default UserInfoComponent;
```

### 4. 완전한 애플리케이션 예제

```tsx
// CompleteApp.tsx
import React, { useState } from "react";
import { 
  AbcWaasProvider, 
  useAbcWaas, 
  useLogin, 
  useLogout 
} from "abc-waas-core-sdk";

// 설정
const config = {
  API_WAAS_MYABCWALLET_URL: process.env.REACT_APP_API_WAAS_MYABCWALLET_URL!,
  MW_MYABCWALLET_URL: process.env.REACT_APP_MW_MYABCWALLET_URL!,
  CLIENT_ID: process.env.REACT_APP_CLIENT_ID!,
  CLIENT_SECRET: process.env.REACT_APP_CLIENT_SECRET!,
};

// 로그인 폼 컴포넌트
function LoginForm() {
  const { loginV2, loginInfo } = useLogin();
  const [formData, setFormData] = useState({
    email: "",
    token: "",
    service: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginV2(formData.email, formData.token, formData.service);
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>로그인</h2>
      
      <div>
        <input
          type="email"
          placeholder="이메일"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>
      
      <div>
        <input
          type="text"
          placeholder="토큰"
          value={formData.token}
          onChange={(e) => setFormData({...formData, token: e.target.value})}
          required
        />
      </div>
      
      <div>
        <input
          type="text"
          placeholder="서비스"
          value={formData.service}
          onChange={(e) => setFormData({...formData, service: e.target.value})}
          required
        />
      </div>
      
      <button type="submit" disabled={loginInfo.loading}>
        {loginInfo.loading ? "로그인 중..." : "로그인"}
      </button>
      
      {loginInfo.error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          에러: {loginInfo.error.message}
        </div>
      )}
    </form>
  );
}

// 메인 앱 컴포넌트
function MainApp() {
  const { email, abcUser, loginInfo } = useAbcWaas();
  const { logoutV2, logoutInfo } = useLogout();

  if (loginInfo.status === "SUCCESS") {
    return (
      <div>
        <h1>ABC WaaS 대시보드</h1>
        
        <div style={{ marginBottom: "20px" }}>
          <h2>사용자 정보</h2>
          <p><strong>이메일:</strong> {email}</p>
        </div>
        
        {abcUser && (
          <div style={{ marginBottom: "20px" }}>
            <h2>지갑 정보</h2>
            <pre style={{ 
              background: "#f5f5f5", 
              padding: "10px", 
              borderRadius: "4px",
              overflow: "auto"
            }}>
              {JSON.stringify(abcUser, null, 2)}
            </pre>
          </div>
        )}
        
        <button 
          onClick={logoutV2}
          disabled={logoutInfo.loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: logoutInfo.loading ? "not-allowed" : "pointer"
          }}
        >
          {logoutInfo.loading ? "로그아웃 중..." : "로그아웃"}
        </button>
        
        {logoutInfo.error && (
          <div style={{ color: "red", marginTop: "10px" }}>
            로그아웃 에러: {logoutInfo.error.message}
          </div>
        )}
      </div>
    );
  }

  return <LoginForm />;
}

// 루트 앱 컴포넌트
function App() {
  return (
    <AbcWaasProvider config={config}>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <MainApp />
      </div>
    </AbcWaasProvider>
  );
}

export default App;
```

### 5. Next.js 예제

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import { AbcWaasProvider } from 'abc-waas-core-sdk';

const config = {
  API_WAAS_MYABCWALLET_URL: process.env.NEXT_PUBLIC_API_WAAS_MYABCWALLET_URL!,
  MW_MYABCWALLET_URL: process.env.NEXT_PUBLIC_MW_MYABCWALLET_URL!,
  CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID!,
  CLIENT_SECRET: process.env.NEXT_PUBLIC_CLIENT_SECRET!,
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AbcWaasProvider config={config}>
      <Component {...pageProps} />
    </AbcWaasProvider>
  );
}
```

## 📚 API 레퍼런스

### 1. AbcWaasProvider

애플리케이션의 최상위에서 ABC WaaS 서비스를 초기화합니다.

**Props**
- `config`: AbcWaasConfigType - 설정 객체
- `children`: React.ReactNode - 자식 컴포넌트

### 2. useAbcWaas Hook

ABC WaaS Context에 접근하는 기본 훅입니다.

**반환 객체**
- `config`: AbcWaasConfigType - 설정 정보
- `basicToken`: string | null - 기본 인증 토큰
- `abcAuth`: any - ABC 인증 정보
- `email`: string | null - 사용자 이메일
- `token`: string | null - 사용자 토큰
- `service`: string | null - 서비스 이름
- `abcWallet`: any - ABC 지갑 정보
- `abcUser`: any - ABC 사용자 정보
- `secureChannel`: any - 보안 채널 정보
- `loginInfo`: 로그인 상태 정보
- `logoutInfo`: 로그아웃 상태 정보

### 3. useLogin Hook

사용자 로그인을 처리하는 훅입니다.

**반환 객체**
- `config`: AbcWaasConfigType - 설정 정보
- `basicToken`: string | null - 기본 인증 토큰
- `email`: string | null - 사용자 이메일
- `token`: string | null - 사용자 토큰
- `service`: string | null - 서비스 이름
- `abcAuth`: any - ABC 인증 정보
- `abcWallet`: any - ABC 지갑 정보
- `abcUser`: any - ABC 사용자 정보
- `secureChannel`: any - 보안 채널 정보
- `loginV2`: 로그인 함수
- `loginInfo`: 로그인 상태 정보
- `setLoginInfo`: 로그인 상태 설정 함수

**loginV2 함수**
- **파라미터**: `email: string`, `token: string`, `service: string`
- **반환값**: `Promise<void>`
- **에러 처리**: 네트워크 오류, 인증 실패, 서버 오류 시 Error 객체 throw

### 4. useLogout Hook

사용자 로그아웃을 처리하는 훅입니다.

**반환 객체**
- `logoutV2`: 로그아웃 함수
- `logoutInfo`: 로그아웃 상태 정보
- `setLogoutInfo`: 로그아웃 상태 설정 함수

**logoutV2 함수**
- **기능**: 세션 스토리지에서 모든 인증 데이터 제거, Context 상태 초기화, 로그아웃 상태 업데이트
- **반환값**: `Promise<void>`

## 🔧 타입 정의

### 상태 타입
```typescript
type UseLoginStatusType = "IDLE" | "LOADING" | "SUCCESS" | "FAILURE";
type UseLogoutStatusType = "IDLE" | "LOADING" | "SUCCESS" | "FAILURE";
```

### 설정 타입
```typescript
interface AbcWaasConfigType {
  API_WAAS_MYABCWALLET_URL: string;
  MW_MYABCWALLET_URL: string;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
}
```

### 보안 채널 타입
```typescript
interface SecureChannelType {
  PrivateKey: string;
  Message: string;
  Encrypted: string;
  ServerPublicKey: string;
  ChannelID: string;
  SecretKey: string;
}
```

## 🛡️ 보안 고려사항

### 1. 클라이언트 시크릿 보안

⚠️ **중요**: `CLIENT_SECRET`은 민감한 정보입니다.

**❌ 잘못된 방법 - 하드코딩**
```typescript
const config = {
  CLIENT_SECRET: "secret_12345", // 절대 금지!
};
```

**✅ 올바른 방법 - 환경 변수**
```typescript
const config = {
  CLIENT_SECRET: process.env.REACT_APP_CLIENT_SECRET!,
};
```

### 2. HTTPS 통신

모든 통신은 HTTPS를 통해 이루어져야 합니다:

**✅ 올바른 설정**
```typescript
const config = {
  API_WAAS_MYABCWALLET_URL: "https://api.abcwallet.com",
  MW_MYABCWALLET_URL: "https://wallet.abcwallet.com",
};
```

### 3. 세션 관리

SDK는 자동으로 세션을 관리하지만, 다음 사항을 주의하세요:

**세션 데이터 저장 위치**
- sessionStorage에 다음 데이터들이 저장됩니다:
  - abcAuth: 인증 토큰
  - abcWallet: 지갑 정보
  - abcUser: 사용자 정보
  - secureChannel: 보안 채널 정보

**보안 권장사항**
1. **XSS 방지**: 사용자 입력 검증 및 이스케이프 처리
2. **CSRF 방지**: 적절한 CSRF 토큰 사용
3. **세션 타임아웃**: 자동 로그아웃 구현
4. **보안 헤더**: 적절한 보안 헤더 설정

## 🐛 에러 처리

### 에러 타입

SDK는 다음과 같은 에러 상황을 처리합니다:

**네트워크 에러**
- "Failed to create secure channel: 500"
- "Network request failed"

**인증 에러**
- "The token was expected to have 3 parts, but got 1."
- "Invalid credentials"

**파싱 에러**
- "[API 호출] Unexpected token < in JSON at position 0"
- "[API 호출] Empty response body"

**검증 에러**
- "Missing required parameter: email"
- "Invalid configuration"

### 에러 처리 예제

```tsx
import React from "react";
import { useLogin } from "abc-waas-core-sdk";

function ErrorHandlingExample() {
  const { loginV2, loginInfo } = useLogin();

  const handleLogin = async () => {
    try {
      await loginV2("user@example.com", "token", "service");
    } catch (error) {
      // 에러 타입별 처리
      if (error instanceof Error) {
        if (error.message.includes("Network request failed")) {
          console.error("네트워크 연결을 확인하세요.");
        } else if (error.message.includes("Invalid credentials")) {
          console.error("인증 정보를 확인하세요.");
        } else if (error.message.includes("Empty response body")) {
          console.error("서버 응답이 비어있습니다.");
        } else {
          console.error("알 수 없는 에러:", error.message);
        }
      }
    }
  };

  return (
    <div>
      <button onClick={handleLogin} disabled={loginInfo.loading}>
        로그인
      </button>
      
      {loginInfo.error && (
        <div style={{ color: "red" }}>
          <h3>에러 발생:</h3>
          <p>{loginInfo.error.message}</p>
        </div>
      )}
    </div>
  );
}
```

## 🔧 문제 해결

### 자주 발생하는 문제

#### "Not found AbcWaasContext" 에러

**원인**: `AbcWaasProvider`로 감싸지 않은 컴포넌트에서 훅 사용

**해결방법**:
```tsx
// ❌ 잘못된 사용
function MyComponent() {
  const { loginV2 } = useLogin(); // 에러 발생!
  return <div>...</div>;
}

// ✅ 올바른 사용
function App() {
  return (
    <AbcWaasProvider config={config}>
      <MyComponent />
    </AbcWaasProvider>
  );
}
```

#### "Failed to create secure channel" 에러

**원인**: 네트워크 연결 문제 또는 잘못된 API URL

**해결방법**:
1. 네트워크 연결 확인
2. API URL 검증
3. CORS 설정 확인

#### "The token was expected to have 3 parts, but got 1" 에러

**원인**: 잘못된 토큰 형식

**해결방법**:
```typescript
// 토큰 형식 확인
const token = "valid.jwt.token"; // JWT 형식이어야 함
await loginV2(email, token, service);
```

## 📦 의존성

### 핵심 의존성
- `@noble/curves`: ^1.9.2 (타원곡선 암호화)
- `@noble/hashes`: ^1.8.0 (해시 함수)
- `crypto-js`: ^4.2.0 (암호화 유틸리티)
- `memory-cache`: ^0.2.0 (메모리 캐시)
- `qs`: ^6.14.0 (쿼리 스트링 파싱)

### 피어 의존성
- `react`: >=18.0.0
- `react-dom`: >=18.0.0

### 개발 의존성
- `@types/crypto-js`: ^4.2.2
- `@types/memory-cache`: ^0.2.6
- `@types/qs`: ^6.14.0
- `@types/react`: ^18.0.0
- `tsup`: ^8.5.0
- `typescript`: ^5.7.3

## 🚀 개발 및 빌드

### 개발 환경 설정

```bash
# 의존성 설치
npm install

# 빌드
npm run build

# 타입 체크
npx tsc --noEmit
```

### 빌드 설정

이 프로젝트는 `tsup`을 사용하여 ESM과 CJS 형식으로 빌드됩니다:

- **ESM**: `dist/index.mjs`
- **CJS**: `dist/index.cjs`
- **타입 정의**: `dist/index.d.ts`

## 📄 라이선스

MIT License

## 🆘 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해 주세요.

---

**ABC WaaS Core SDK v0.2.12** - React 애플리케이션을 위한 안전하고 간편한 지갑 통합 솔루션
