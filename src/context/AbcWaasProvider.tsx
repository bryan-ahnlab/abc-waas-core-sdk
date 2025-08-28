// src/context/AbcWaasProvider.tsx

import React, { ReactNode, useState } from "react";
import { AbcWaasContext } from "./AbcWaasContext";
import type { AbcWaasConfigType } from "@/types/config";

interface Props {
  config: AbcWaasConfigType;
  children: ReactNode;
}

export const AbcWaasProvider = ({ config, children }: Props) => {
  const [basicToken, setBasicToken] = useState<string | null>(null);

  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [service, setService] = useState<string | null>(null);

  const [abcAuth, setAbcAuth] = useState<any>(null);
  const [abcWallet, setAbcWallet] = useState<any>(null);
  const [abcUser, setAbcUser] = useState<any>(null);
  const [secureChannel, setSecureChannel] = useState<any>(null);

  return (
    <AbcWaasContext.Provider
      value={{
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
      }}
    >
      {children}
    </AbcWaasContext.Provider>
  );
};
