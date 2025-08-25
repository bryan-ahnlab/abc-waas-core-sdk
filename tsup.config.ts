// tsup.config.ts

/**
 * tsup 빌드 설정 파일
 *
 * tsup은 TypeScript/JavaScript 라이브러리를 위한 빠르고 간단한 번들러입니다.
 * 이 설정은 라이브러리를 다양한 모듈 시스템에서 사용할 수 있도록 빌드합니다.
 */

import { defineConfig } from "tsup";

export default defineConfig({
  // 번들링할 진입점 파일들
  // src/index.ts에서 시작하여 의존성을 따라 번들링합니다
  entry: ["src/index.ts"],

  // 출력 형식 설정
  // - "esm": ES Modules (import/export) - 최신 브라우저와 Node.js에서 사용
  // - "cjs": CommonJS (require/module.exports) - 레거시 Node.js 환경에서 사용
  format: ["esm", "cjs"],

  // TypeScript 타입 정의 파일 생성 설정
  dts: {
    // 외부 라이브러리의 타입 정의도 함께 포함하여 완전한 타입 지원 제공
    resolve: true,
  },

  // 빌드 전에 dist 폴더를 완전히 정리하여 이전 빌드 결과물 제거
  // 캐시나 오래된 파일로 인한 문제를 방지합니다
  clean: true,

  // 외부 의존성으로 처리할 패키지들
  // 이 패키지들은 번들에 포함되지 않고 런타임에 제공되어야 함을 명시
  // React 관련 패키지들은 보통 사용자 환경에서 제공되므로 번들에 포함하지 않습니다
  external: ["react", "react-dom"],

  // Tree shaking 활성화
  // 사용되지 않는 코드를 제거하여 번들 크기를 최적화합니다
  treeshake: true,

  // 소스맵 생성
  // 디버깅 시 원본 TypeScript 코드를 확인할 수 있도록 도와줍니다
  sourcemap: true,
});
