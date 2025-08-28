import { createContext, useState, useContext, useCallback } from 'react';
import { jsx } from 'react/jsx-runtime';
import { p256 } from '@noble/curves/p256';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import CryptoJS from 'crypto-js';
import qs from 'qs';
import mCache from 'memory-cache';

// src/context/AbcWaasProvider.tsx
var AbcWaasContext = createContext(null);
var AbcWaasProvider = ({ config, children }) => {
  const [basicToken, setBasicToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [token, setToken] = useState(null);
  const [service, setService] = useState(null);
  const [abcAuth, setAbcAuth] = useState(null);
  const [abcWallet, setAbcWallet] = useState(null);
  const [abcUser, setAbcUser] = useState(null);
  const [secureChannel, setSecureChannel] = useState(null);
  return /* @__PURE__ */ jsx(
    AbcWaasContext.Provider,
    {
      value: {
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
        setSecureChannel
      },
      children
    }
  );
};
function useAbcWaas() {
  const context = useContext(AbcWaasContext);
  if (!context) {
    throw new Error("Not found AbcWaasContext");
  }
  return context;
}

// src/utilities/parser.ts
async function safeParseJson(response, label = "Unknown Error") {
  const text = await response.text();
  if (!text) {
    if (!response.ok) {
      throw new Error(`[${label}] Empty response body`);
    }
    return null;
  }
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`[${label}] ${text}`);
  }
  if (!response.ok) {
    throw new Error(`[${label}] ${JSON.stringify(data, null, 2)}`);
  }
  return data;
}

// src/api/common/secureChannel.ts
var AES_KEY_LENGTH = 32;
async function createSecureChannel(config) {
  try {
    const keyPair = createKeypair();
    const message = "AhnLab Blockchain Company";
    const formData = qs.stringify({
      pubkey: bytesToHex(keyPair.publicKey),
      plain: message
    });
    const response = await fetch(
      `${config.API_WAAS_MYABCWALLET_URL}/secure/channel/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData
      }
    );
    if (!response.ok)
      throw new Error(`Failed to create secure channel: ${response.status}`);
    const responseData = await safeParseJson(response, "createSecureChannel");
    const serverPubkey = hexToBytes(responseData.publickey);
    const shared = p256.getSharedSecret(keyPair.privateKey, serverPubkey);
    const sharedX = shared.slice(1, 33);
    const secretKey = bytesToHex(sharedX).padStart(64, "0");
    const result = {
      ChannelID: responseData.channelid,
      Encrypted: responseData.encrypted,
      ServerPublicKey: responseData.publickey,
      Message: message,
      PrivateKey: bytesToHex(keyPair.privateKey),
      SecretKey: secretKey
    };
    mCache.put(
      "secureChannel",
      { data: responseData, keyPair, secretKey },
      20 * 60 * 1e3
    );
    sessionStorage.setItem("secureChannel", JSON.stringify(result));
    return result;
  } catch (error) {
    console.error("Create Secure Channel Error: ", error);
    throw error;
  }
}
function createKeypair() {
  const privateKey = p256.utils.randomPrivateKey();
  const publicKey = p256.getPublicKey(privateKey, false);
  return { privateKey, publicKey };
}
var randomPassword = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return password;
};
var encryptedPassword = (secret) => {
  const key = CryptoJS.enc.Hex.parse(secret.substring(0, 32)).toString(CryptoJS.enc.Hex).substring(0, 32);
  const iv = CryptoJS.enc.Hex.parse(secret.substring(AES_KEY_LENGTH));
  const encrypted = CryptoJS.AES.encrypt(
    randomPassword(),
    CryptoJS.enc.Hex.parse(key),
    {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
};

// src/api/v2/auth.ts
async function postTokenLoginV2(config, basicToken, token, service) {
  return fetch(
    `${config.API_WAAS_MYABCWALLET_URL}/auth/auth-service/v2/token/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicToken}`
      },
      body: new URLSearchParams({
        token,
        service,
        audience: config.MW_MYABCWALLET_URL
      })
    }
  );
}

// src/api/v2/member.ts
async function postMemberJoinV2(config, basicToken, username, code, socialtype, overage = "1", agree = "1", collect = "1", thirdparty = "1", advertise = "1") {
  return fetch(
    `${config.API_WAAS_MYABCWALLET_URL}/member/user-management/v2/join`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicToken}`
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
        advertise
      })
    }
  );
}

// src/api/v2/wallet.ts
async function getMpcWalletsInfoV2(config, accessToken) {
  return fetch(`${config.API_WAAS_MYABCWALLET_URL}/wapi/v2/mpc/wallets/info`, {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${accessToken}`
    }
  });
}
async function postMpcWalletsV2(config, accessToken, email, channelid, devicePassword) {
  return fetch(`${config.API_WAAS_MYABCWALLET_URL}/wapi/v2/mpc/wallets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${accessToken}`,
      "Secure-Channel": channelid
    },
    body: new URLSearchParams({
      email,
      devicePassword
    })
  });
}

// src/hooks/useLogin.ts
function useLogin() {
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
    setSecureChannel
  } = useAbcWaas();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loginV2 = useCallback(
    async (email2, token2, service2) => {
      try {
        setLoading(true);
        setError(null);
        setEmail(email2);
        setToken(token2);
        setService(service2);
        const secureChannel2 = await createSecureChannel(config);
        setSecureChannel(secureChannel2);
        const basicToken2 = btoa(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`);
        setBasicToken(basicToken2);
        const tryLogin = await postTokenLoginV2(
          config,
          basicToken2,
          token2,
          service2
        );
        const tryLoginData = await tryLogin.json();
        let accessToken = null;
        if (tryLogin.ok) {
          accessToken = tryLoginData.access_token;
          setAbcAuth(tryLoginData);
          sessionStorage.setItem("abcAuth", JSON.stringify(tryLoginData));
        }
        if (tryLogin.status === 422 && tryLoginData.code === 618) {
          const {
            email: email3,
            sixcode,
            token: newToken
          } = JSON.parse(tryLoginData.msg);
          const joinRes = await postMemberJoinV2(
            config,
            basicToken2,
            email3,
            sixcode,
            service2
          );
          if (!(joinRes == null ? void 0 : joinRes.ok)) {
            throw new Error(JSON.stringify(joinRes));
          }
          const retryLogin = await postTokenLoginV2(
            config,
            basicToken2,
            newToken,
            service2
          );
          const retryLoginData = await safeParseJson(
            retryLogin,
            "postTokenLoginV2"
          );
          if (!retryLogin.ok) {
            throw new Error(JSON.stringify(retryLoginData));
          }
          accessToken = retryLoginData.access_token;
          setAbcAuth(retryLoginData);
          sessionStorage.setItem("abcAuth", JSON.stringify(retryLoginData));
        }
        const channelid = secureChannel2.ChannelID;
        const secretKey = secureChannel2.SecretKey;
        const devicePassword = encryptedPassword(secretKey);
        const createMpcWallets = await postMpcWalletsV2(
          config,
          accessToken,
          email2,
          channelid,
          devicePassword
        );
        const createMpcWalletsData = await safeParseJson(
          createMpcWallets,
          "postMpcWalletsV2"
        );
        if (!createMpcWallets.ok) {
          throw new Error(JSON.stringify(createMpcWalletsData));
        }
        if (createMpcWalletsData.message === "The token was expected to have 3 parts, but got 1.") {
          throw new Error(JSON.stringify(createMpcWalletsData));
        }
        setAbcWallet(createMpcWalletsData);
        sessionStorage.setItem(
          "abcWallet",
          JSON.stringify(createMpcWalletsData)
        );
        const mpcWalletsInfo = await getMpcWalletsInfoV2(config, accessToken);
        const mpcWalletsInfoData = await safeParseJson(
          mpcWalletsInfo,
          "getMpcWalletsInfoV2"
        );
        if (!mpcWalletsInfo.ok) {
          throw new Error(JSON.stringify(mpcWalletsInfoData));
        }
        if (mpcWalletsInfoData.message === "The token was expected to have 3 parts, but got 1.") {
          throw new Error(JSON.stringify(mpcWalletsInfoData));
        }
        if (mpcWalletsInfoData.message === "MPC KeyShare Recover Error") {
          throw new Error(JSON.stringify(mpcWalletsInfoData));
        }
        if (mpcWalletsInfoData.message === "KeyShare generate failed.") {
          throw new Error(JSON.stringify(mpcWalletsInfoData));
        }
        setAbcUser(mpcWalletsInfoData);
        sessionStorage.setItem("abcUser", JSON.stringify(mpcWalletsInfoData));
        return;
      } catch (error2) {
        setError(error2);
        throw error2;
      } finally {
        setLoading(false);
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
    loading,
    setLoading,
    error,
    setError
  };
}

export { AbcWaasProvider, useAbcWaas, useLogin };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map