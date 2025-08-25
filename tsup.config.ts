// tsup.config.ts

/**
 * tsup 빌드 설정 파일
 *
 * React/Next.js 개발자를 위한 SDK 빌드 설정
 * 현대적인 React 생태계는 ESM을 기본으로 사용하므로 ESM만 지원하도록 최적화
 */

import { defineConfig } from "tsup";

export default defineConfig({
  // 번들링할 진입점 파일들
  // src/index.ts에서 시작하여 의존성을 따라 번들링합니다
  entry: ["src/index.ts"],

  // ESM 형식만 출력 (React/Next.js 생태계에 최적화)
  // - Next.js 13+ App Router는 ESM을 기본으로 사용
  // - React 18+의 새로운 기능들은 ESM 환경에서 최적화됨
  // - Tree shaking이 ESM에서 더 효과적
  format: ["esm"],

  // TypeScript 타입 정의 파일 생성 설정
  dts: {
    // 외부 라이브러리의 타입 정의도 함께 포함하여 완전한 타입 지원 제공
    resolve: true,
  },

  // 빌드 전에 dist 폴더를 완전히 정리하여 이전 빌드 결과물 제거
  // 캐시나 오래된 파일로 인한 문제를 방지합니다
  clean: true,

  // 외부 의존성으로 처리할 패키지들
  // React 관련 패키지들은 사용자 환경에서 제공되므로 번들에 포함하지 않습니다
  // 이는 번들 크기 최적화와 버전 충돌 방지를 위해 필요합니다
  external: ["react", "react-dom"],

  // Tree shaking 활성화
  // 사용되지 않는 코드를 제거하여 번들 크기를 최적화합니다
  // ESM 환경에서 더욱 효과적으로 작동합니다
  treeshake: true,

  // 소스맵 생성
  // 디버깅 시 원본 TypeScript 코드를 확인할 수 있도록 도와줍니다
  sourcemap: true,
});
