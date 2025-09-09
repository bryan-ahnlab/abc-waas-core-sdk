// src/types/context.ts

import { AbcWaasConfigType } from "@/types/config";

export interface AbcWaasContextType {
  config: AbcWaasConfigType;

  basicToken: string | null;
  setBasicToken: (basicToken: string | null) => void;

  email: string | null;
  setEmail: (email: string | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  service: string | null;
  setService: (service: string | null) => void;

  abcAuth: any;
  setAbcAuth: (abcAuth: any) => void;
  abcWallet: any;
  setAbcWallet: (abcWallet: any) => void;
  abcUser: any;
  setAbcUser: (abcUser: any) => void;
  secureChannel: any;
  setSecureChannel: (secureChannel: any) => void;
}
