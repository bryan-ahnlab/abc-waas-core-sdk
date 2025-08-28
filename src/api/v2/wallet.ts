// src/api/v2/wallet.ts

import { AbcWaasConfigType } from "@/types/config";

export async function getMpcWalletsInfoV2(
  config: AbcWaasConfigType,
  accessToken: string
) {
  return fetch(`${config.API_WAAS_MYABCWALLET_URL}/wapi/v2/mpc/wallets/info`, {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function postMpcWalletsV2(
  config: AbcWaasConfigType,
  accessToken: string,
  email: string,
  channelid: string,
  devicePassword: string
) {
  return fetch(`${config.API_WAAS_MYABCWALLET_URL}/wapi/v2/mpc/wallets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${accessToken}`,
      "Secure-Channel": channelid,
    },
    body: new URLSearchParams({
      email,
      devicePassword,
    }),
  });
}
