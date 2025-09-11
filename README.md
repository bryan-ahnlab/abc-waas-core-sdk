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
    setBasicToken,

    // 사용자 정보
    email,
    setEmail,
    token,
    setToken,
    service,
    setService,

    // ABC 데이터
    abcAuth,
    setAbcAuth,
    abcWallet,
    setAbcWallet,
    abcUser,
    setAbcUser,
    secureChannel,
    setSecureChannel,

    // 로그인 상태
    loginInfo,
    setLoginInfo,

    // 로그아웃 상태
    logoutInfo,
    setLogoutInfo,
  } = useAbcWaas();

  return (
    <div>
      <h3>전역 상태 모니터링</h3>
      <p>로그인 상태: {loginInfo.status}</p>
      <p>로그인 로딩: {loginInfo.loading ? "진행중" : "완료"}</p>
      <p>로그아웃 상태: {logoutInfo.status}</p>
      <p>이메일: {email || "없음"}</p>
      <p>인증 정보: {abcAuth ? "있음" : "없음"}</p>
    </div>
  );
}
```

#### 반환값

**설정:**

- `config`: ABC WaaS 설정 객체

**인증 관련:**

- `basicToken`: 기본 토큰 (`string | null`)
- `setBasicToken`: 기본 토큰 설정 함수

**사용자 정보:**

- `email`: 사용자 이메일 (`string | null`)
- `setEmail`: 이메일 설정 함수
- `token`: 소셜 로그인 토큰 (`string | null`)
- `setToken`: 토큰 설정 함수
- `service`: 소셜 서비스 타입 (`string | null`)
- `setService`: 서비스 설정 함수

**ABC 데이터:**

- `abcAuth`: ABC 인증 정보 (`any`)
- `setAbcAuth`: ABC 인증 정보 설정 함수
- `abcWallet`: ABC 지갑 정보 (`any`)
- `setAbcWallet`: ABC 지갑 정보 설정 함수
- `abcUser`: ABC 사용자 정보 (`any`)
- `setAbcUser`: ABC 사용자 정보 설정 함수
- `secureChannel`: 보안 채널 객체 (`any`)
- `setSecureChannel`: 보안 채널 설정 함수

**로그인 상태:**

- `loginInfo`: 로그인 상태 정보
- `setLoginInfo`: 로그인 상태 설정 함수

**로그아웃 상태:**

- `logoutInfo`: 로그아웃 상태 정보
- `setLogoutInfo`: 로그아웃 상태 설정 함수

### useLogin()

로그인 기능을 제공하는 훅입니다.

```tsx
import { useLogin } from "abc-waas-core-sdk";

function LoginComponent() {
  const {
    loginV2,
    loginInfo,
    setLoginInfo,
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
      await loginV2("user@example.com", "google-token", "google");
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <div>
      <h3>로그인</h3>
      {loginInfo.status === "SUCCESS" && <p>로그인 성공!</p>}
      {loginInfo.status === "FAILURE" && (
        <p>로그인 실패: {loginInfo.error?.message}</p>
      )}
      {loginInfo.status === "LOADING" && <p>로그인 중...</p>}

      <button onClick={handleLogin} disabled={loginInfo.loading}>
        {loginInfo.loading ? "로그인 중..." : "로그인"}
      </button>
    </div>
  );
}
```

#### 반환값

**메서드:**

- `loginV2(email: string, token: string, service: string)`: V2 로그인 API 호출

**상태:**

- `loginInfo`: 로그인 상태 정보
  - `loading`: 로그인 진행 중 여부 (`boolean`)
  - `error`: 로그인 에러 정보 (`Error | null`)
  - `status`: 로그인 상태 (`UseLoginStatusType | null`)
- `setLoginInfo`: 로그인 상태 설정 함수

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

### useLogout()

로그아웃 기능을 제공하는 훅입니다.

```tsx
import { useLogout } from "abc-waas-core-sdk";

function LogoutComponent() {
  const { logoutV2, logoutInfo, setLogoutInfo } = useLogout();

  const handleLogout = async () => {
    try {
      await logoutV2();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <div>
      <h3>로그아웃</h3>
      {logoutInfo.status === "SUCCESS" && <p>로그아웃 완료!</p>}
      {logoutInfo.status === "FAILURE" && (
        <p>로그아웃 실패: {logoutInfo.error?.message}</p>
      )}
      {logoutInfo.status === "LOADING" && <p>로그아웃 중...</p>}

      <button onClick={handleLogout} disabled={logoutInfo.loading}>
        {logoutInfo.loading ? "로그아웃 중..." : "로그아웃"}
      </button>
    </div>
  );
}
```

#### 반환값

**메서드:**

- `logoutV2()`: 로그아웃 실행 (세션 정리 및 Context 초기화)

**상태:**

- `logoutInfo`: 로그아웃 상태 정보
  - `loading`: 로그아웃 진행 중 여부 (`boolean`)
  - `error`: 로그아웃 에러 정보 (`Error | null`)
  - `status`: 로그아웃 상태 (`UseLogoutStatusType | null`)
- `setLogoutInfo`: 로그아웃 상태 설정 함수

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

### LoginInfo / LogoutInfo

```typescript
interface LoginInfo {
  loading: boolean;
  error: Error | null;
  status: UseLoginStatusType | null;
}

interface LogoutInfo {
  loading: boolean;
  error: Error | null;
  status: UseLogoutStatusType | null;
}
```

## 사용 예시

### 완전한 로그인/로그아웃 플로우

```tsx
import {
  AbcWaasProvider,
  useAbcWaas,
  useLogin,
  useLogout,
} from "abc-waas-core-sdk";

const config = {
  API_WAAS_MYABCWALLET_URL: "https://api.example.com",
  MW_MYABCWALLET_URL: "https://wallet.example.com",
  CLIENT_ID: "your-client-id",
  CLIENT_SECRET: "your-client-secret",
};

function App() {
  return (
    <AbcWaasProvider config={config}>
      <AuthApp />
    </AbcWaasProvider>
  );
}

function AuthApp() {
  // 전역 상태 모니터링
  const { loginInfo, logoutInfo } = useAbcWaas();

  return (
    <div>{loginInfo.status === "SUCCESS" ? <Dashboard /> : <LoginPage />}</div>
  );
}

function LoginPage() {
  // 로그인 기능 사용
  const { loginV2, loginInfo } = useLogin();

  const handleLogin = async () => {
    try {
      await loginV2("user@example.com", "google-token", "google");
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <div>
      <h2>로그인이 필요합니다</h2>
      <button onClick={handleLogin} disabled={loginInfo.loading}>
        {loginInfo.loading ? "로그인 중..." : "로그인"}
      </button>
      {loginInfo.error && <p>에러: {loginInfo.error.message}</p>}
    </div>
  );
}

function Dashboard() {
  // 로그아웃 기능 사용
  const { logoutV2, logoutInfo } = useLogout();

  const handleLogout = async () => {
    try {
      await logoutV2();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <div>
      <h2>대시보드</h2>
      <button onClick={handleLogout} disabled={logoutInfo.loading}>
        {logoutInfo.loading ? "로그아웃 중..." : "로그아웃"}
      </button>
      {logoutInfo.error && <p>에러: {logoutInfo.error.message}</p>}
    </div>
  );
}
```

### 상태 동기화 예시

```tsx
function StatusMonitor() {
  // useAbcWaas로 전역 상태 모니터링
  const { loginInfo, logoutInfo, email, abcAuth } = useAbcWaas();

  return (
    <div>
      <h3>상태 모니터</h3>
      <p>로그인 상태: {loginInfo.status}</p>
      <p>로그아웃 상태: {logoutInfo.status}</p>
      <p>이메일: {email || "없음"}</p>
      <p>인증 정보: {abcAuth ? "있음" : "없음"}</p>
    </div>
  );
}

function LoginButton() {
  // useLogin으로 로그인 실행
  const { loginV2, loginInfo } = useLogin();

  return (
    <button onClick={() => loginV2("test@example.com", "token", "google")}>
      로그인
    </button>
  );
}

function LogoutButton() {
  // useLogout으로 로그아웃 실행
  const { logoutV2, logoutInfo } = useLogout();

  return <button onClick={logoutV2}>로그아웃</button>;
}

// 모든 컴포넌트에서 상태가 실시간으로 동기화됨
function App() {
  return (
    <AbcWaasProvider config={config}>
      <StatusMonitor />
      <LoginButton />
      <LogoutButton />
    </AbcWaasProvider>
  );
}
```

## 주요 특징

1. **전역 상태 관리**: `useAbcWaas`를 통해 모든 상태에 접근 가능
2. **상태 동기화**: 모든 훅에서 동일한 상태를 공유하고 실시간 동기화
3. **세션 관리**: 로그인 시 세션 스토리지에 데이터 저장, 로그아웃 시 정리
4. **에러 처리**: 각 단계별 에러를 적절히 처리하고 상태로 관리
5. **타입 안전성**: TypeScript로 작성되어 타입 안전성을 보장
6. **독립적 훅**: `useLogin`, `useLogout`은 각각 필요한 기능만 제공

## 훅별 기능 비교

| 기능            | useAbcWaas   | useLogin     | useLogout |
| --------------- | ------------ | ------------ | --------- |
| 전역 상태 접근  | ✅ 모든 상태 | ✅ 모든 상태 | ❌ 없음   |
| `loginV2` 함수  | ❌ 없음      | ✅ 있음      | ❌ 없음   |
| `logoutV2` 함수 | ❌ 없음      | ❌ 없음      | ✅ 있음   |
| `loginInfo`     | ✅ 있음      | ✅ 있음      | ❌ 없음   |
| `logoutInfo`    | ✅ 있음      | ❌ 없음      | ✅ 있음   |
| `setLoginInfo`  | ✅ 있음      | ✅ 있음      | ❌ 없음   |
| `setLogoutInfo` | ✅ 있음      | ❌ 없음      | ✅ 있음   |

## 주의사항

- `loginInfo`와 `logoutInfo`의 `status` 초기값은 `null`입니다.
- 로그아웃 시 모든 Context 값들이 `null`로 초기화됩니다.
- 세션 데이터는 `sessionStorage`에 저장되므로 브라우저 탭을 닫으면 삭제됩니다.
- `abcAuth`, `abcWallet`, `abcUser`, `secureChannel`의 타입은 `any`로 정의되어 있습니다.
- 모든 훅은 `AbcWaasProvider` 내부에서만 사용할 수 있습니다.
