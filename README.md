# ABC WaaS Core SDK

ABC WaaS (Wallet as a Service) Core SDK는 React/Next.js 애플리케이션에서 ABC 지갑 서비스를 쉽게 통합할 수 있도록 도와주는 TypeScript 라이브러리입니다.

## 주요 기능

- 🔐 **보안 채널 생성**: P-256 ECDH 키 교환을 통한 안전한 통신
- 🔑 **토큰 기반 인증**: OAuth2 스타일의 토큰 인증 시스템
- 👤 **사용자 관리**: 회원가입 및 로그인 처리
- 💼 **MPC 지갑**: Multi-Party Computation 기반 지갑 생성 및 관리
- 🎯 **React Hooks**: 직관적인 React 훅 기반 API
- 📱 **세션 관리**: 자동 세션 복원 및 상태 관리
- 🛡️ **타입 안전성**: 완전한 TypeScript 지원

## 설치

```bash
npm install abc-waas-core-sdk
```

## 설정

### AbcWaasProvider 설정

애플리케이션의 최상위에 `AbcWaasProvider`를 설정합니다.

```tsx
import { AbcWaasProvider } from "abc-waas-core-sdk";

const config = {
  API_WAAS_MYABCWALLET_URL: "https://api.example.com",
  MW_MYABCWALLET_URL: "https://wallet.example.com",
  CLIENT_ID: "your-client-id",
  CLIENT_SECRET: "your-client-secret",
};

function App() {
  return (
    <AbcWaasProvider config={config}>
      <YourApp />
    </AbcWaasProvider>
  );
}
```

### 설정 옵션

| 옵션                       | 타입     | 설명                   |
| -------------------------- | -------- | ---------------------- |
| `API_WAAS_MYABCWALLET_URL` | `string` | ABC WaaS API 서버 URL  |
| `MW_MYABCWALLET_URL`       | `string` | MyABCWallet 서비스 URL |
| `CLIENT_ID`                | `string` | 클라이언트 ID          |
| `CLIENT_SECRET`            | `string` | 클라이언트 시크릿      |

## Hooks

### useAbcWaas()

ABC WaaS Context에 접근하는 기본 훅입니다. 모든 전역 상태와 설정 함수에 접근할 수 있습니다.

```tsx
import { useAbcWaas } from "abc-waas-core-sdk";

function MyComponent() {
  const {
    // 설정
    config,

    // 인증 관련
    basicToken,
    abcAuth,

    // 사용자 정보
    email,
    token,
    service,

    // 지갑 정보
    abcWallet,
    abcUser,

    // 보안 채널
    secureChannel,

    // 로그인 상태
    loginInfo,

    // 로그아웃 상태
    logoutInfo,
  } = useAbcWaas();

  return (
    <div>
      <p>이메일: {email}</p>
      <p>로그인 상태: {loginInfo.status}</p>
    </div>
  );
}
```

### useLogin()

사용자 로그인을 처리하는 훅입니다.

```tsx
import { useLogin } from "abc-waas-core-sdk";

function LoginComponent() {
  const { loginV2, loginInfo } = useLogin();

  const handleLogin = async () => {
    try {
      await loginV2("user@example.com", "user-token", "service-name");
      console.log("로그인 성공!");
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin} disabled={loginInfo.loading}>
        {loginInfo.loading ? "로그인 중..." : "로그인"}
      </button>

      {loginInfo.error && (
        <p style={{ color: "red" }}>에러: {loginInfo.error.message}</p>
      )}

      {loginInfo.status === "SUCCESS" && (
        <p style={{ color: "green" }}>로그인 성공!</p>
      )}
    </div>
  );
}
```

#### loginV2() 파라미터

| 파라미터  | 타입     | 설명          |
| --------- | -------- | ------------- |
| `email`   | `string` | 사용자 이메일 |
| `token`   | `string` | 사용자 토큰   |
| `service` | `string` | 서비스 이름   |

#### 로그인 상태

| 상태      | 설명           |
| --------- | -------------- |
| `IDLE`    | 초기 상태      |
| `LOADING` | 로그인 진행 중 |
| `SUCCESS` | 로그인 성공    |
| `FAILURE` | 로그인 실패    |

### useLogout()

사용자 로그아웃을 처리하는 훅입니다.

```tsx
import { useLogout } from "abc-waas-core-sdk";

function LogoutComponent() {
  const { logoutV2, logoutInfo } = useLogout();

  const handleLogout = async () => {
    try {
      await logoutV2();
      console.log("로그아웃 성공!");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <div>
      <button onClick={handleLogout} disabled={logoutInfo.loading}>
        {logoutInfo.loading ? "로그아웃 중..." : "로그아웃"}
      </button>

      {logoutInfo.error && (
        <p style={{ color: "red" }}>에러: {logoutInfo.error.message}</p>
      )}

      {logoutInfo.status === "SUCCESS" && (
        <p style={{ color: "green" }}>로그아웃 성공!</p>
      )}
    </div>
  );
}
```

## 완전한 예제

```tsx
import React from "react";
import {
  AbcWaasProvider,
  useAbcWaas,
  useLogin,
  useLogout,
} from "abc-waas-core-sdk";

// 설정
const config = {
  API_WAAS_MYABCWALLET_URL: "https://api.example.com",
  MW_MYABCWALLET_URL: "https://wallet.example.com",
  CLIENT_ID: "your-client-id",
  CLIENT_SECRET: "your-client-secret",
};

// 로그인 컴포넌트
function LoginForm() {
  const { loginV2, loginInfo } = useLogin();
  const [email, setEmail] = React.useState("");
  const [token, setToken] = React.useState("");
  const [service, setService] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginV2(email, token, service);
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="토큰"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="서비스"
        value={service}
        onChange={(e) => setService(e.target.value)}
        required
      />
      <button type="submit" disabled={loginInfo.loading}>
        {loginInfo.loading ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}

// 사용자 정보 컴포넌트
function UserInfo() {
  const { email, abcUser, loginInfo } = useAbcWaas();
  const { logoutV2, logoutInfo } = useLogout();

  if (loginInfo.status !== "SUCCESS") {
    return <LoginForm />;
  }

  return (
    <div>
      <h2>사용자 정보</h2>
      <p>이메일: {email}</p>
      <p>지갑 정보: {JSON.stringify(abcUser, null, 2)}</p>

      <button onClick={logoutV2} disabled={logoutInfo.loading}>
        {logoutInfo.loading ? "로그아웃 중..." : "로그아웃"}
      </button>
    </div>
  );
}

// 메인 앱 컴포넌트
function App() {
  return (
    <AbcWaasProvider config={config}>
      <div className="App">
        <h1>ABC WaaS 예제</h1>
        <UserInfo />
      </div>
    </AbcWaasProvider>
  );
}

export default App;
```

## API 레퍼런스

### 타입 정의

#### AbcWaasConfigType

```typescript
interface AbcWaasConfigType {
  API_WAAS_MYABCWALLET_URL: string;
  MW_MYABCWALLET_URL: string;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
}
```

#### AbcWaasContextType

```typescript
interface AbcWaasContextType {
  config: AbcWaasConfigType;

  // 인증 관련
  basicToken: string | null;
  abcAuth: any;

  // 사용자 정보
  email: string | null;
  token: string | null;
  service: string | null;

  // 지갑 정보
  abcWallet: any;
  abcUser: any;

  // 보안 채널
  secureChannel: any;

  // 로그인 상태
  loginInfo: {
    loading: boolean;
    error: Error | null;
    status: UseLoginStatusType | null;
  };

  // 로그아웃 상태
  logoutInfo: {
    loading: boolean;
    error: Error | null;
    status: UseLogoutStatusType | null;
  };
}
```

#### 상태 타입

```typescript
type UseLoginStatusType = "IDLE" | "LOADING" | "SUCCESS" | "FAILURE";
type UseLogoutStatusType = "IDLE" | "LOADING" | "SUCCESS" | "FAILURE";
```

## 보안 고려사항

1. **클라이언트 시크릿**: 프로덕션 환경에서는 클라이언트 시크릿을 안전하게 관리하세요.
2. **HTTPS**: 모든 통신은 HTTPS를 통해 이루어져야 합니다.
3. **세션 관리**: 자동 세션 복원 기능이 활성화되어 있어 보안에 주의하세요.
4. **토큰 보안**: 액세스 토큰은 세션 스토리지에 저장되므로 XSS 공격에 주의하세요.

## 에러 처리

SDK는 다양한 에러 상황을 처리합니다:

- **네트워크 에러**: API 호출 실패
- **인증 에러**: 잘못된 토큰 또는 권한 부족
- **파싱 에러**: 잘못된 JSON 응답
- **검증 에러**: 필수 파라미터 누락

모든 에러는 `loginInfo.error` 또는 `logoutInfo.error`를 통해 확인할 수 있습니다.

## 개발 및 빌드

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

## 라이선스

MIT License

## 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해 주세요.

---

**ABC WaaS Core SDK** - React 애플리케이션을 위한 안전하고 간편한 지갑 통합 솔루션
