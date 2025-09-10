// src/hooks/useLogout.ts

import React, { useCallback, useState } from "react";
import { useAbcWaas } from "@/hooks/useAbcWaas";
import { UseLogoutStatusType } from "@/types/hook";

export function useLogout() {
  const {
    setBasicToken,

    setEmail,
    setToken,
    setService,

    setAbcAuth,
    setAbcWallet,
    setAbcUser,
    setSecureChannel,

    logoutInfo,
    setLogoutInfo,
  } = useAbcWaas();

  const logoutV2 = useCallback(async () => {
    try {
      setLogoutInfo({
        loading: true,
        error: null,
        status: "LOADING",
      });

      sessionStorage.removeItem("abcAuth");
      sessionStorage.removeItem("abcWallet");
      sessionStorage.removeItem("abcUser");
      sessionStorage.removeItem("secureChannel");

      setBasicToken(null);
      setEmail(null);
      setToken(null);
      setService(null);
      setAbcAuth(null);
      setAbcWallet(null);
      setAbcUser(null);
      setSecureChannel(null);

      setLogoutInfo({
        loading: false,
        error: null,
        status: "SUCCESS",
      });
    } catch (error: any) {
      setLogoutInfo({
        loading: false,
        error: error,
        status: "FAILURE",
      });
      throw error;
    }
  }, [
    setBasicToken,
    setEmail,
    setToken,
    setService,
    setAbcAuth,
    setAbcWallet,
    setAbcUser,
    setSecureChannel,
  ]);

  return {
    logoutV2,

    logoutInfo,
    setLogoutInfo,
  };
}
