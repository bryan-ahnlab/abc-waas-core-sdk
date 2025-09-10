import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

interface AbcWaasConfigType {
    API_WAAS_MYABCWALLET_URL: string;
    MW_MYABCWALLET_URL: string;
    CLIENT_ID: string;
    CLIENT_SECRET: string;
}

interface Props {
    config: AbcWaasConfigType;
    children: ReactNode;
}
declare const AbcWaasProvider: ({ config, children }: Props) => react_jsx_runtime.JSX.Element;

type UseLoginStatusType = "IDLE" | "LOADING" | "SUCCESS" | "FAILURE";
type UseLogoutStatusType = "IDLE" | "LOADING" | "SUCCESS" | "FAILURE";

interface AbcWaasContextType {
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
    loginInfo: {
        loading: boolean;
        error: Error | null;
        status: UseLoginStatusType | null;
    };
    setLoginInfo: ({ loading, error, status, }: {
        loading: boolean;
        error: Error | null;
        status: UseLoginStatusType | null;
    }) => void;
    logoutInfo: {
        loading: boolean;
        error: Error | null;
        status: UseLogoutStatusType | null;
    };
    setLogoutInfo: ({ loading, error, status, }: {
        loading: boolean;
        error: Error | null;
        status: UseLogoutStatusType | null;
    }) => void;
}

declare function useAbcWaas(): AbcWaasContextType;

declare function useLogin(): {
    config: AbcWaasConfigType;
    basicToken: string | null;
    email: string | null;
    token: string | null;
    service: string | null;
    abcAuth: any;
    abcWallet: any;
    abcUser: any;
    secureChannel: any;
    loginV2: (email: string, token: string, service: string) => Promise<void>;
    loginInfo: {
        loading: boolean;
        error: Error | null;
        status: UseLoginStatusType | null;
    };
    setLoginInfo: ({ loading, error, status, }: {
        loading: boolean;
        error: Error | null;
        status: UseLoginStatusType | null;
    }) => void;
};

declare function useLogout(): {
    logoutV2: () => Promise<void>;
    logoutInfo: {
        loading: boolean;
        error: Error | null;
        status: UseLogoutStatusType | null;
    };
    setLogoutInfo: ({ loading, error, status, }: {
        loading: boolean;
        error: Error | null;
        status: UseLogoutStatusType | null;
    }) => void;
};

export { type AbcWaasConfigType, type AbcWaasContextType, AbcWaasProvider, type UseLoginStatusType, type UseLogoutStatusType, useAbcWaas, useLogin, useLogout };
