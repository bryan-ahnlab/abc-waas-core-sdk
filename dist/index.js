'use strict';

var react = require('react');
var jsxRuntime = require('react/jsx-runtime');
var p256 = require('@noble/curves/p256');
var utils = require('@noble/hashes/utils');
var CryptoJS = require('crypto-js');
var qs = require('qs');
var mCache = require('memory-cache');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var CryptoJS__default = /*#__PURE__*/_interopDefault(CryptoJS);
var qs__default = /*#__PURE__*/_interopDefault(qs);
var mCache__default = /*#__PURE__*/_interopDefault(mCache);

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var AbcWaasContext = react.createContext(null);
var AbcWaasProvider = ({ config, children }) => {
  const [basicToken, setBasicTokenState] = react.useState(null);
  const [email, setEmailState] = react.useState(null);
  const [token, setTokenState] = react.useState(null);
  const [service, setServiceState] = react.useState(null);
  const [abcAuth, setAbcAuthState] = react.useState(null);
  const [abcWallet, setAbcWalletState] = react.useState(null);
  const [abcUser, setAbcUserState] = react.useState(null);
  const [secureChannel, setSecureChannelState] = react.useState(null);
  const [loginInfo, setLoginInfoState] = react.useState({
    loading: false,
    error: null,
    status: "IDLE"
  });
  const [logoutInfo, setLogoutInfoState] = react.useState({
    loading: false,
    error: null,
    status: "IDLE"
  });
  const setBasicToken = react.useCallback((basicToken2) => {
    setBasicTokenState(basicToken2);
  }, []);
  const setEmail = react.useCallback((email2) => {
    setEmailState(email2);
  }, []);
  const setToken = react.useCallback((token2) => {
    setTokenState(token2);
  }, []);
  const setService = react.useCallback((service2) => {
    setServiceState(service2);
  }, []);
  const setAbcAuth = react.useCallback((abcAuth2) => {
    setAbcAuthState(abcAuth2);
  }, []);
  const setAbcWallet = react.useCallback((abcWallet2) => {
    setAbcWalletState(abcWallet2);
  }, []);
  const setAbcUser = react.useCallback((abcUser2) => {
    setAbcUserState(abcUser2);
  }, []);
  const setSecureChannel = react.useCallback((secureChannel2) => {
    setSecureChannelState(secureChannel2);
  }, []);
  const setLoginInfo = react.useCallback(
    (login) => {
      setLoginInfoState(login);
    },
    []
  );
  const setLogoutInfo = react.useCallback(
    (logout) => {
      setLogoutInfoState(logout);
    },
    []
  );
  const abcAuthState = react.useMemo(
    () => ({
      basicToken,
      setBasicToken,
      abcAuth,
      setAbcAuth
    }),
    [basicToken, abcAuth, setBasicToken, setAbcAuth]
  );
  const abcWalletState = react.useMemo(
    () => ({
      abcWallet,
      setAbcWallet,
      abcUser,
      setAbcUser
    }),
    [abcWallet, abcUser, setAbcWallet, setAbcUser]
  );
  const abcUserState = react.useMemo(
    () => ({
      email,
      setEmail,
      token,
      setToken,
      service,
      setService
    }),
    [email, token, service, setEmail, setToken, setService]
  );
  const secureChannelState = react.useMemo(
    () => ({
      secureChannel,
      setSecureChannel
    }),
    [secureChannel, setSecureChannel]
  );
  const loginState = react.useMemo(
    () => ({
      loginInfo,
      setLoginInfo
    }),
    [loginInfo, setLoginInfo]
  );
  const logoutState = react.useMemo(
    () => ({
      logoutInfo,
      setLogoutInfo
    }),
    [logoutInfo, setLogoutInfo]
  );
  const contextValue = react.useMemo(
    () => __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({
      config
    }, abcAuthState), abcWalletState), abcUserState), secureChannelState), loginState), logoutState),
    [
      config,
      abcAuthState,
      abcUserState,
      abcWalletState,
      secureChannelState,
      loginState,
      logoutState
    ]
  );
  return /* @__PURE__ */ jsxRuntime.jsx(AbcWaasContext.Provider, { value: contextValue, children });
};
function useAbcWaas() {
  const context = react.useContext(AbcWaasContext);
  if (!context) {
    throw new Error("Not found AbcWaasContext");
  }
  return context;
}

// src/utilities/parser.ts
async function parseJson(response, label = "Unknown Error") {
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
    const formData = qs__default.default.stringify({
      pubkey: utils.bytesToHex(keyPair.publicKey),
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
    const responseData = await parseJson(response, "createSecureChannel");
    const serverPubkey = utils.hexToBytes(responseData.publickey);
    const shared = p256.p256.getSharedSecret(keyPair.privateKey, serverPubkey);
    const sharedX = shared.slice(1, 33);
    const secretKey = utils.bytesToHex(sharedX).padStart(64, "0");
    const result = {
      ChannelID: responseData.channelid,
      Encrypted: responseData.encrypted,
      ServerPublicKey: responseData.publickey,
      Message: message,
      PrivateKey: utils.bytesToHex(keyPair.privateKey),
      SecretKey: secretKey
    };
    mCache__default.default.put(
      "secureChannel",
      { data: responseData, keyPair, secretKey },
      30 * 60 * 1e3
      // 30 minutes
    );
    sessionStorage.setItem("secureChannel", JSON.stringify(result));
    return result;
  } catch (error) {
    console.error("Create Secure Channel Error: ", error);
    throw error;
  }
}
function createKeypair() {
  const privateKey = p256.p256.utils.randomPrivateKey();
  const publicKey = p256.p256.getPublicKey(privateKey, false);
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
  const key = CryptoJS__default.default.enc.Hex.parse(secret.substring(0, 32)).toString(CryptoJS__default.default.enc.Hex).substring(0, 32);
  const iv = CryptoJS__default.default.enc.Hex.parse(secret.substring(AES_KEY_LENGTH));
  const encrypted = CryptoJS__default.default.AES.encrypt(
    randomPassword(),
    CryptoJS__default.default.enc.Hex.parse(key),
    {
      iv,
      mode: CryptoJS__default.default.mode.CBC,
      padding: CryptoJS__default.default.pad.Pkcs7
    }
  );
  return encrypted.ciphertext.toString(CryptoJS__default.default.enc.Base64);
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
    setSecureChannel,
    loginInfo,
    setLoginInfo
  } = useAbcWaas();
  const loginV2 = react.useCallback(
    async (email2, token2, service2) => {
      try {
        setLoginInfo({
          loading: true,
          error: null,
          status: "LOADING"
        });
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
          const joinMember = await postMemberJoinV2(
            config,
            basicToken2,
            email3,
            sixcode,
            service2
          );
          if (!(joinMember == null ? void 0 : joinMember.ok)) {
            setLoginInfo({
              loading: false,
              error: new Error(JSON.stringify(joinMember)),
              status: "FAILURE"
            });
            throw new Error(JSON.stringify(joinMember));
          }
          const retryLogin = await postTokenLoginV2(
            config,
            basicToken2,
            newToken,
            service2
          );
          const retryLoginData = await parseJson(
            retryLogin,
            "postTokenLoginV2"
          );
          if (!retryLogin.ok) {
            setLoginInfo({
              loading: false,
              error: new Error(JSON.stringify(retryLoginData)),
              status: "FAILURE"
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
            status: "FAILURE"
          });
          throw new Error(JSON.stringify(tryLoginData));
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
        const createMpcWalletsData = await parseJson(
          createMpcWallets,
          "postMpcWalletsV2"
        );
        if (!createMpcWallets.ok) {
          setLoginInfo({
            loading: false,
            error: new Error(JSON.stringify(createMpcWalletsData)),
            status: "FAILURE"
          });
          throw new Error(JSON.stringify(createMpcWalletsData));
        }
        if (createMpcWalletsData.message === "The token was expected to have 3 parts, but got 1.") {
          setLoginInfo({
            loading: false,
            error: new Error(JSON.stringify(createMpcWalletsData)),
            status: "FAILURE"
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
            status: "FAILURE"
          });
          throw new Error(JSON.stringify(mpcWalletsInfoData));
        }
        if (mpcWalletsInfoData.message === "The token was expected to have 3 parts, but got 1.") {
          setLoginInfo({
            loading: false,
            error: new Error(JSON.stringify(mpcWalletsInfoData)),
            status: "FAILURE"
          });
          throw new Error(JSON.stringify(mpcWalletsInfoData));
        }
        if (mpcWalletsInfoData.message === "MPC KeyShare Recover Error") {
          setLoginInfo({
            loading: false,
            error: new Error(JSON.stringify(mpcWalletsInfoData)),
            status: "FAILURE"
          });
          throw new Error(JSON.stringify(mpcWalletsInfoData));
        }
        if (mpcWalletsInfoData.message === "KeyShare generate failed.") {
          setLoginInfo({
            loading: false,
            error: new Error(JSON.stringify(mpcWalletsInfoData)),
            status: "FAILURE"
          });
          throw new Error(JSON.stringify(mpcWalletsInfoData));
        }
        setAbcUser(mpcWalletsInfoData);
        sessionStorage.setItem("abcUser", JSON.stringify(mpcWalletsInfoData));
        setLoginInfo({
          loading: false,
          error: null,
          status: "SUCCESS"
        });
        return;
      } catch (error) {
        setLoginInfo({
          loading: false,
          error,
          status: "FAILURE"
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
    setLoginInfo
  };
}
function useLogout() {
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
    setLogoutInfo
  } = useAbcWaas();
  const logoutV2 = react.useCallback(async () => {
    try {
      setLogoutInfo({
        loading: true,
        error: null,
        status: "LOADING"
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
        status: "SUCCESS"
      });
    } catch (error) {
      setLogoutInfo({
        loading: false,
        error,
        status: "FAILURE"
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
    setSecureChannel
  ]);
  return {
    logoutV2,
    logoutInfo,
    setLogoutInfo
  };
}

exports.AbcWaasProvider = AbcWaasProvider;
exports.useAbcWaas = useAbcWaas;
exports.useLogin = useLogin;
exports.useLogout = useLogout;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map