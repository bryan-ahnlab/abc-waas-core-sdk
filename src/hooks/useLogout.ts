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
  } = useAbcWaas();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<UseLogoutStatusType | null>(null);

  const logoutV2 = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setStatus("LOADING");

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

      setStatus("SUCCESS");
    } catch (error: any) {
      setError(error);
      setStatus("FAILURE");
      throw error;
    } finally {
      setLoading(false);
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

    loading,
    setLoading,
    error,
    setError,
    status,
    setStatus,
  };
}
