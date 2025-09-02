// src/context/AbcWaasProvider.tsx

import React, { ReactNode, useState, useMemo, useCallback } from "react";
import { AbcWaasContext } from "@/context/AbcWaasContext";
import type { AbcWaasConfigType } from "@/types/config";

interface Props {
  config: AbcWaasConfigType;
  children: ReactNode;
}

export const AbcWaasProvider = ({ config, children }: Props) => {
  const [basicToken, setBasicTokenState] = useState<string | null>(null);
  const [email, setEmailState] = useState<string | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [service, setServiceState] = useState<string | null>(null);
  const [abcAuth, setAbcAuthState] = useState<any>(null);
  const [abcWallet, setAbcWalletState] = useState<any>(null);
  const [abcUser, setAbcUserState] = useState<any>(null);
  const [secureChannel, setSecureChannelState] = useState<any>(null);

  const setBasicToken = useCallback((basicToken: string | null) => {
    setBasicTokenState(basicToken);
  }, []);

  const setEmail = useCallback((email: string | null) => {
    setEmailState(email);
  }, []);

  const setToken = useCallback((token: string | null) => {
    setTokenState(token);
  }, []);

  const setService = useCallback((service: string | null) => {
    setServiceState(service);
  }, []);

  const setAbcAuth = useCallback((abcAuth: any) => {
    setAbcAuthState(abcAuth);
  }, []);

  const setAbcWallet = useCallback((abcWallet: any) => {
    setAbcWalletState(abcWallet);
  }, []);

  const setAbcUser = useCallback((abcUser: any) => {
    setAbcUserState(abcUser);
  }, []);

  const setSecureChannel = useCallback((secureChannel: any) => {
    setSecureChannelState(secureChannel);
  }, []);

  const abcAuthState = useMemo(
    () => ({
      basicToken,
      setBasicToken,
      abcAuth,
      setAbcAuth,
    }),
    [basicToken, abcAuth, setBasicToken, setAbcAuth]
  );

  const abcWalletState = useMemo(
    () => ({
      abcWallet,
      setAbcWallet,
      abcUser,
      setAbcUser,
    }),
    [abcWallet, abcUser, setAbcWallet, setAbcUser]
  );

  const abcUserState = useMemo(
    () => ({
      email,
      setEmail,
      token,
      setToken,
      service,
      setService,
    }),
    [email, token, service, setEmail, setToken, setService]
  );

  const secureChannelState = useMemo(
    () => ({
      secureChannel,
      setSecureChannel,
    }),
    [secureChannel, setSecureChannel]
  );

  const contextValue = useMemo(
    () => ({
      config,
      ...abcAuthState,
      ...abcWalletState,
      ...abcUserState,
      ...secureChannelState,
    }),
    [config, abcAuthState, abcUserState, abcWalletState, secureChannelState]
  );

  return (
    <AbcWaasContext.Provider value={contextValue}>
      {children}
    </AbcWaasContext.Provider>
  );
};
