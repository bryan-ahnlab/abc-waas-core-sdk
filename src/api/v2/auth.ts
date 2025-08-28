// src/api/v2/auth.ts

import { AbcWaasConfigType } from "@/types/config";

export async function postTokenLoginV2(
  config: AbcWaasConfigType,
  basicToken: string,
  token: string,
  service: string
) {
  return fetch(
    `${config.API_WAAS_MYABCWALLET_URL}/auth/auth-service/v2/token/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicToken}`,
      },
      body: new URLSearchParams({
        token,
        service,
        audience: config.MW_MYABCWALLET_URL,
      }),
    }
  );
}
