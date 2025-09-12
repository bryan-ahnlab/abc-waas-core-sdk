// src/context/AbcWaasProvider.tsx

import React, {
  ReactNode,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { AbcWaasContext } from "@/context/AbcWaasContext";
import type { AbcWaasConfigType } from "@/types/config";
import { UseLoginStatusType, UseLogoutStatusType } from "@/types/hook";

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

  /* useLogin */
  const [loginInfo, setLoginInfoState] = useState<{
    loading: boolean;
    error: Error | null;
    status: UseLoginStatusType | null;
  }>({
    loading: false,
    error: null,
    status: "IDLE",
  });

  /* useLogout */
  const [logoutInfo, setLogoutInfoState] = useState<{
    loading: boolean;
    error: Error | null;
    status: UseLogoutStatusType | null;
  }>({
    loading: false,
    error: null,
    status: "IDLE",
  });

  useEffect(() => {
    try {
      const storedAbcAuth = sessionStorage.getItem("abcAuth");
      const storedAbcWallet = sessionStorage.getItem("abcWallet");
      const storedAbcUser = sessionStorage.getItem("abcUser");
      const storedSecureChannel = sessionStorage.getItem("secureChannel");

      if (config?.CLIENT_ID && config?.CLIENT_SECRET) {
        const basicToken = btoa(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`);
        setBasicTokenState(basicToken);
      }

      if (storedAbcAuth) {
        const abcAuthData = JSON.parse(storedAbcAuth);
        setAbcAuthState(abcAuthData);
      }

      if (storedAbcWallet) {
        const abcWalletData = JSON.parse(storedAbcWallet);
        setAbcWalletState(abcWalletData);
      }

      if (storedAbcUser) {
        const abcUserData = JSON.parse(storedAbcUser);
        setAbcUserState(abcUserData);
      }

      if (storedSecureChannel) {
        const secureChannelData = JSON.parse(storedSecureChannel);
        setSecureChannelState(secureChannelData);
      }

      if (
        storedAbcAuth &&
        storedAbcWallet &&
        storedAbcUser &&
        storedSecureChannel
      ) {
        setLoginInfoState({
          loading: false,
          error: null,
          status: "SUCCESS",
        });
      }
    } catch (error) {
      console.error(error);
      sessionStorage.removeItem("abcAuth");
      sessionStorage.removeItem("abcWallet");
      sessionStorage.removeItem("abcUser");
      sessionStorage.removeItem("secureChannel");

      setBasicTokenState(null);
      setAbcAuthState(null);
      setAbcWalletState(null);
      setAbcUserState(null);
      setSecureChannelState(null);
    }
  }, [config]);

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

  /* useLogin */
  const setLoginInfo = useCallback(
    (login: {
      loading: boolean;
      error: Error | null;
      status: UseLoginStatusType | null;
    }) => {
      setLoginInfoState(login);
    },
    []
  );

  /* useLogout */
  const setLogoutInfo = useCallback(
    (logout: {
      loading: boolean;
      error: Error | null;
      status: UseLogoutStatusType | null;
    }) => {
      setLogoutInfoState(logout);
    },
    []
  );

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

  /* useLogin */
  const loginState = useMemo(
    () => ({
      loginInfo,
      setLoginInfo,
    }),
    [loginInfo, setLoginInfo]
  );

  /* useLogout */
  const logoutState = useMemo(
    () => ({
      logoutInfo,
      setLogoutInfo,
    }),
    [logoutInfo, setLogoutInfo]
  );

  const contextValue = useMemo(
    () => ({
      config,
      ...abcAuthState,
      ...abcWalletState,
      ...abcUserState,
      ...secureChannelState,
      ...loginState,
      ...logoutState,
    }),
    [
      config,
      abcAuthState,
      abcUserState,
      abcWalletState,
      secureChannelState,
      loginState,
      logoutState,
    ]
  );

  return (
    <AbcWaasContext.Provider value={contextValue}>
      {children}
    </AbcWaasContext.Provider>
  );
};
