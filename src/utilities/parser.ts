// src/utilities/parser.ts

/**
 * HTTP 응답을 안전하게 JSON으로 파싱하는 유틸리티 함수
 *
 * 이 함수는 HTTP 응답을 받아서 JSON으로 파싱하고, 다양한 에러 상황을 적절히 처리합니다.
 * 빈 응답 본문, JSON 파싱 실패, HTTP 에러 상태 등 모든 케이스를 처리합니다.
 *
 * @param response - 파싱할 HTTP Response 객체
 * @param label - 에러 메시지에 포함될 라벨 (기본값: "Unknown Error")
 * @returns 파싱된 JSON 데이터 또는 null (빈 본문인 경우)
 * @throws {Error} JSON 파싱 실패, HTTP 에러 응답, 또는 빈 본문 에러 시
 *
 * @example
 * ```typescript
 * try {
 *   const response = await fetch('/api/data');
 *   const data = await parseJson(response, 'API 호출');
 *   if (data !== null) {
 *     console.log('성공:', data);
 *   } else {
 *     console.log('빈 응답');
 *   }
 * } catch (error) {
 *   console.error('API 에러:', error.message);
 * }
 * ```
 */
export async function parseJson(
  response: Response,
  label: string = "Unknown Error"
) {
  // 응답 본문을 텍스트로 먼저 읽어옵니다
  // JSON.parse() 전에 텍스트로 변환하는 것이 안전합니다
  const text = await response.text();

  // 빈 본문 처리
  // 서버에서 응답 본문 없이 상태 코드만 보내는 경우를 처리합니다
  if (!text) {
    if (!response.ok) {
      // HTTP 에러 상태이면서 빈 본문인 경우
      // 서버 에러이지만 상세 정보가 없는 상황을 명시합니다
      throw new Error(`[${label}] Empty response body`);
    }
    // 성공 상태이지만 빈 본문인 경우 (예: 204 No Content)
    // null을 반환하여 호출자가 빈 응답임을 알 수 있도록 합니다
    return null;
  }

  let data: any;
  try {
    // 텍스트를 JSON으로 파싱 시도
    // 잘못된 JSON 형식이면 여기서 에러가 발생합니다
    data = JSON.parse(text);
  } catch {
    // JSON 파싱이 실패한 경우
    // 원본 텍스트를 포함한 에러를 던져서 디버깅에 도움을 줍니다
    // HTML 에러 페이지나 잘못된 JSON 형식 등을 확인할 수 있습니다
    throw new Error(`[${label}] ${text}`);
  }

  // JSON 파싱은 성공했지만 HTTP 상태 코드가 에러인 경우
  // (예: 400, 401, 403, 404, 500 등)
  // 서버에서 에러 응답을 JSON 형태로 보낸 경우를 처리합니다
  if (!response.ok) {
    // 에러 응답의 JSON 데이터를 보기 좋게 포맷팅하여 에러 메시지에 포함
    // null, 2는 JSON.stringify의 들여쓰기 옵션입니다
    throw new Error(`[${label}] ${JSON.stringify(data, null, 2)}`);
  }

  // 모든 검증을 통과한 경우 성공적으로 파싱된 데이터를 반환
  return data;
}
