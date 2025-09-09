# ABC WaaS Core SDK

ABC WaaS (Wallet as a Service) Core SDK는 React 애플리케이션에서 ABC 지갑 서비스를 쉽게 통합할 수 있도록 도와주는 라이브러리입니다.

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

## Hooks

### useLogin()

로그인 기능을 제공하는 훅입니다.

```tsx
import { useLogin } from "abc-waas-core-sdk";

function LoginComponent() {
  const {
    loginV2,
    loading,
    error,
    status,
    email,
    token,
    service,
    abcAuth,
    abcWallet,
    abcUser,
    secureChannel,
    config,
    basicToken,
  } = useLogin();

  const handleLogin = async () => {
    try {
      await loginV2("user@example.com", "social-token", "google");
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <div>
      {status === "SUCCESS" && <p>로그인 성공!</p>}
      {status === "FAILURE" && <p>로그인 실패: {error?.message}</p>}
      {status === "LOADING" && <p>로그인 중...</p>}

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "로그인 중..." : "로그인"}
      </button>
    </div>
  );
}
```

#### 반환값

**메서드:**

- `loginV2(email: string, token: string, service: string)`: V2 로그인 API 호출

**상태:**

- `loading`: 로그인 진행 중 여부 (`boolean`)
- `error`: 로그인 에러 정보 (`Error | null`)
- `status`: 로그인 상태 (`UseLoginStatusType | null`)
  - `"IDLE"`: 초기 상태
  - `"LOADING"`: 로그인 진행 중
  - `"SUCCESS"`: 로그인 성공
  - `"FAILURE"`: 로그인 실패

**데이터:**

- `email`: 사용자 이메일 (`string | null`)
- `token`: 소셜 로그인 토큰 (`string | null`)
- `service`: 소셜 서비스 타입 (`string | null`)
- `abcAuth`: ABC 인증 정보 (`any`)
- `abcWallet`: ABC 지갑 정보 (`any`)
- `abcUser`: ABC 사용자 정보 (`any`)
- `secureChannel`: 보안 채널 객체 (`any`)
- `config`: ABC WaaS 설정 객체
- `basicToken`: 기본 토큰 (`string | null`)

**Setter 함수들:**

- `setLoading(loading: boolean)`: 로딩 상태 설정
- `setError(error: Error | null)`: 에러 상태 설정
- `setStatus(status: UseLoginStatusType | null)`: 상태 설정

### useLogout()

로그아웃 기능을 제공하는 훅입니다.

```tsx
import { useLogout } from "abc-waas-core-sdk";

function LogoutComponent() {
  const { logoutV2, loading, error, status } = useLogout();

  const handleLogout = async () => {
    try {
      await logoutV2();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <div>
      {status === "SUCCESS" && <p>로그아웃 완료!</p>}
      {status === "FAILURE" && <p>로그아웃 실패: {error?.message}</p>}
      {status === "LOADING" && <p>로그아웃 중...</p>}

      <button onClick={handleLogout} disabled={loading}>
        {loading ? "로그아웃 중..." : "로그아웃"}
      </button>
    </div>
  );
}
```

#### 반환값

**메서드:**

- `logoutV2()`: 로그아웃 실행 (세션 정리 및 Context 초기화)

**상태:**

- `loading`: 로그아웃 진행 중 여부 (`boolean`)
- `error`: 로그아웃 에러 정보 (`Error | null`)
- `status`: 로그아웃 상태 (`UseLogoutStatusType | null`)
  - `"IDLE"`: 초기 상태
  - `"LOADING"`: 로그아웃 진행 중
  - `"SUCCESS"`: 로그아웃 성공
  - `"FAILURE"`: 로그아웃 실패

**Setter 함수들:**

- `setLoading(loading: boolean)`: 로딩 상태 설정
- `setError(error: Error | null)`: 에러 상태 설정
- `setStatus(status: UseLogoutStatusType | null)`: 상태 설정

### useAbcWaas()

ABC WaaS Context에 접근하는 기본 훅입니다.

```tsx
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
    setBasicToken,
    setEmail,
    setToken,
    setService,
    setAbcAuth,
    setAbcWallet,
    setAbcUser,
    setSecureChannel,
  } = useAbcWaas();

  // Context 값들을 직접 조작할 수 있습니다
}
```

## Types

### AbcWaasConfigType

```typescript
interface AbcWaasConfigType {
  API_WAAS_MYABCWALLET_URL: string;
  MW_MYABCWALLET_URL: string;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
}
```

### UseLoginStatusType

```typescript
type UseLoginStatusType = "IDLE" | "LOADING" | "SUCCESS" | "FAILURE";
```

### UseLogoutStatusType

```typescript
type UseLogoutStatusType = "IDLE" | "LOADING" | "SUCCESS" | "FAILURE";
```

## 사용 예시

### 완전한 로그인/로그아웃 플로우

```tsx
import { AbcWaasProvider, useLogin, useLogout } from "abc-waas-core-sdk";

const config = {
  API_WAAS_MYABCWALLET_URL: "https://api.example.com",
  MW_MYABCWALLET_URL: "https://wallet.example.com",
  CLIENT_ID: "your-client-id",
  CLIENT_SECRET: "your-client-secret",
};

function App() {
  return (
    <AbcWaasProvider config={config}>
      <AuthComponent />
    </AbcWaasProvider>
  );
}

function AuthComponent() {
  const { loginV2, status: loginStatus, email, abcAuth } = useLogin();
  const { logoutV2, status: logoutStatus } = useLogout();

  const handleLogin = async () => {
    try {
      await loginV2("user@example.com", "google-token", "google");
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutV2();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  if (loginStatus === "SUCCESS") {
    return (
      <div>
        <h2>로그인됨</h2>
        <p>이메일: {email}</p>
        <p>인증 정보: {abcAuth ? "있음" : "없음"}</p>
        <button onClick={handleLogout} disabled={logoutStatus === "LOADING"}>
          {logoutStatus === "LOADING" ? "로그아웃 중..." : "로그아웃"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>로그인이 필요합니다</h2>
      <button onClick={handleLogin} disabled={loginStatus === "LOADING"}>
        {loginStatus === "LOADING" ? "로그인 중..." : "로그인"}
      </button>
    </div>
  );
}
```

## 주요 특징

1. **상태 관리**: 각 훅은 독립적인 `loading`, `error`, `status` 상태를 관리합니다.
2. **Context 공유**: `useAbcWaas`를 통해 전역 상태를 공유합니다.
3. **세션 관리**: 로그인 시 세션 스토리지에 데이터를 저장하고, 로그아웃 시 정리합니다.
4. **에러 처리**: 각 단계별 에러를 적절히 처리하고 상태로 관리합니다.
5. **타입 안전성**: TypeScript로 작성되어 타입 안전성을 보장합니다.

## 주의사항

- `useLogin`과 `useLogout`의 `status` 초기값은 `null`입니다.
- 로그아웃 시 모든 Context 값들이 `null`로 초기화됩니다.
- 세션 데이터는 `sessionStorage`에 저장되므로 브라우저 탭을 닫으면 삭제됩니다.
- `abcAuth`, `abcWallet`, `abcUser`, `secureChannel`의 타입은 `any`로 정의되어 있습니다.
