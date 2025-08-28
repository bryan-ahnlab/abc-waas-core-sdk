// src/api/v2/member.ts

import { AbcWaasConfigType } from "@/types/config";

export async function postMemberJoinV2(
  config: AbcWaasConfigType,
  basicToken: string,
  username: string,
  code: string,
  socialtype: string,
  overage = "1",
  agree = "1",
  collect = "1",
  thirdparty = "1",
  advertise = "1"
) {
  return fetch(
    `${config.API_WAAS_MYABCWALLET_URL}/member/user-management/v2/join`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicToken}`,
      },
      body: new URLSearchParams({
        username,
        code,
        serviceid: config.MW_MYABCWALLET_URL,
        socialtype,
        overage,
        agree,
        collect,
        thirdparty,
        advertise,
      }),
    }
  );
}
