// src/hooks/useLogin.ts

import React, { useCallback } from "react";
import { useAbcWaas } from "@/hooks/useAbcWaas";
import {
  createSecureChannel,
  encryptedPassword,
} from "@/api/common/secureChannel";
import { postTokenLoginV2 } from "@/api/v2/auth";
import { postMemberJoinV2 } from "@/api/v2/member";
import { getMpcWalletsInfoV2, postMpcWalletsV2 } from "@/api/v2/wallet";
import { parseJson } from "@/utilities/parser";
import { UseLoginStatusType } from "@/types/hook";

export function useLogin() {
  const {
    config,

    basicToken,
    setBasicToken,

    email,
    setEmail,
    token,
    setToken,
    service,
    setService,

    abcAuth,
    setAbcAuth,
    abcWallet,
    setAbcWallet,
    abcUser,
    setAbcUser,
    secureChannel,
    setSecureChannel,

    loginInfo,
    setLoginInfo,
  } = useAbcWaas();

  const loginV2 = useCallback(
    async (email: string, token: string, service: string) => {
      try {
        setLoginInfo({
          loading: true,
          error: null,
          status: "LOADING",
        });

        setEmail(email);
        setToken(token);
        setService(service);

        const secureChannel = await createSecureChannel(config);
        setSecureChannel(secureChannel);

        const basicToken = btoa(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`);
        setBasicToken(basicToken);

        const tryLogin = await postTokenLoginV2(
          config,
          basicToken,
          token,
          service
        );

        const tryLoginData = await tryLogin.json(); // { access_token, refresh_token, token_type, expire_in }

        let accessToken = null;

        if (tryLogin.ok) {
          accessToken = tryLoginData.access_token;
          setAbcAuth(tryLoginData);
          sessionStorage.setItem("abcAuth", JSON.stringify(tryLoginData));
        }

        if (tryLogin.status === 422 && tryLoginData.code === 618) {
          const {
            email,
            sixcode,
            token: newToken,
          } = JSON.parse(tryLoginData.msg);

          const joinMember = await postMemberJoinV2(
            config,
            basicToken,
            email,
            sixcode,
            service
          );
          if (!joinMember?.ok) {
            setLoginInfo({
              loading: false,
              error: new Error(JSON.stringify(joinMember)),
              status: "FAILURE",
            });
            throw new Error(JSON.stringify(joinMember));
          }

          const retryLogin = await postTokenLoginV2(
            config,
            basicToken,
            newToken,
            service
          );
          const retryLoginData = await parseJson(
            retryLogin,
            "postTokenLoginV2"
          ); // { access_token, refresh_token, token_type, expire_in }
          if (!retryLogin.ok) {
            setLoginInfo({
              loading: false,
              error: new Error(JSON.stringify(retryLoginData)),
              status: "FAILURE",
            });
            throw new Error(JSON.stringify(retryLoginData));
          }

          accessToken = retryLoginData.access_token;
          setAbcAuth(retryLoginData);
          sessionStorage.setItem("abcAuth", JSON.stringify(retryLoginData));
        } else if (!tryLogin.ok) {
          setLoginInfo({
            loading: false,
            error: new Error(JSON.stringify(tryLoginData)),
            status: "FAILURE",
          });
          throw new Error(JSON.stringify(tryLoginData));
        }

        /*  */

        const channelid = secureChannel.ChannelID;
        const secretKey = secureChannel.SecretKey;

        const devicePassword = encryptedPassword(secretKey);

        const createMpcWallets = await postMpcWalletsV2(
          config,
          accessToken,
          email,
          channelid,
          devicePassword
        );

        const createMpcWalletsData = await parseJson(
          createMpcWallets,
          "postMpcWalletsV2"
        );
        if (!createMpcWallets.ok) {
          setLoginInfo({
            loading: false,
            error: new Error(JSON.stringify(createMpcWalletsData)),
            status: "FAILURE",
          });
          throw new Error(JSON.stringify(createMpcWalletsData));
        }
        if (
          createMpcWalletsData.message ===
          "The token was expected to have 3 parts, but got 1."
        ) {
          setLoginInfo({
            loading: false,
            error: new Error(JSON.stringify(createMpcWalletsData)),
            status: "FAILURE",
          });
          throw new Error(JSON.stringify(createMpcWalletsData));
        }

        setAbcWallet(createMpcWalletsData);
        sessionStorage.setItem(
          "abcWallet",
          JSON.stringify(createMpcWalletsData)
        );

        const mpcWalletsInfo = await getMpcWalletsInfoV2(config, accessToken);

        const mpcWalletsInfoData = await parseJson(
          mpcWalletsInfo,
          "getMpcWalletsInfoV2"
        );
        if (!mpcWalletsInfo.ok) {
          setLoginInfo({
            loading: false,
            error: new Error(JSON.stringify(mpcWalletsInfoData)),
            status: "FAILURE",
          });
          throw new Error(JSON.stringify(mpcWalletsInfoData));
        }
        if (
          mpcWalletsInfoData.message ===
          "The token was expected to have 3 parts, but got 1."
        ) {
          setLoginInfo({
            loading: false,
            error: new Error(JSON.stringify(mpcWalletsInfoData)),
            status: "FAILURE",
          });
          throw new Error(JSON.stringify(mpcWalletsInfoData));
        }
        if (mpcWalletsInfoData.message === "MPC KeyShare Recover Error") {
          setLoginInfo({
            loading: false,
            error: new Error(JSON.stringify(mpcWalletsInfoData)),
            status: "FAILURE",
          });
          throw new Error(JSON.stringify(mpcWalletsInfoData));
        }
        if (mpcWalletsInfoData.message === "KeyShare generate failed.") {
          setLoginInfo({
            loading: false,
            error: new Error(JSON.stringify(mpcWalletsInfoData)),
            status: "FAILURE",
          });
          throw new Error(JSON.stringify(mpcWalletsInfoData));
        }

        setAbcUser(mpcWalletsInfoData);
        sessionStorage.setItem("abcUser", JSON.stringify(mpcWalletsInfoData));

        setLoginInfo({
          loading: false,
          error: null,
          status: "SUCCESS",
        });
        return;
      } catch (error: any) {
        setLoginInfo({
          loading: false,
          error: error,
          status: "FAILURE",
        });
        throw error;
      }
    },
    [config]
  );

  return {
    config,

    basicToken,

    email,
    token,
    service,

    abcAuth,
    abcWallet,
    abcUser,
    secureChannel,

    loginV2,
    loginInfo,
    setLoginInfo,
  };
}
