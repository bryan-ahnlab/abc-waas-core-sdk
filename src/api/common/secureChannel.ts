// src/api/secureChannel.ts

import { p256 } from "@noble/curves/p256";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import CryptoJS from "crypto-js";
import qs from "qs";
import mCache from "memory-cache";
import { parseJson } from "@/utilities/parser";

export type SecureChannelType = {
  PrivateKey: string;
  Message: string;
  Encrypted: string;
  ServerPublicKey: string;
  ChannelID: string;
  SecretKey: string;
};

interface KeyPairType {
  privateKey: Uint8Array;
  publicKey: Uint8Array;
}

const AES_KEY_LENGTH = 32;

export async function createSecureChannel(config: {
  API_WAAS_MYABCWALLET_URL: string;
  MW_MYABCWALLET_URL: string;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
}): Promise<SecureChannelType> {
  try {
    const keyPair = createKeypair();
    const message = "AhnLab Blockchain Company";

    const formData = qs.stringify({
      pubkey: bytesToHex(keyPair.publicKey),
      plain: message,
    });

    const response = await fetch(
      `${config.API_WAAS_MYABCWALLET_URL}/secure/channel/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      }
    );

    if (!response.ok)
      throw new Error(`Failed to create secure channel: ${response.status}`);
    const responseData = await parseJson(response, "createSecureChannel");

    const serverPubkey = hexToBytes(responseData.publickey);
    const shared = p256.getSharedSecret(keyPair.privateKey, serverPubkey);
    const sharedX = shared.slice(1, 33); // remove prefix (04)

    const secretKey = bytesToHex(sharedX).padStart(64, "0");

    const result: SecureChannelType = {
      ChannelID: responseData.channelid,
      Encrypted: responseData.encrypted,
      ServerPublicKey: responseData.publickey,
      Message: message,
      PrivateKey: bytesToHex(keyPair.privateKey),
      SecretKey: secretKey,
    };

    mCache.put(
      "secureChannel",
      { data: responseData, keyPair, secretKey },
      20 * 60 * 1000
    );
    sessionStorage.setItem("secureChannel", JSON.stringify(result));

    return result;
  } catch (error: any) {
    console.error("Create Secure Channel Error: ", error);
    throw error;
  }
}

function createKeypair(): KeyPairType {
  const privateKey = p256.utils.randomPrivateKey();
  const publicKey = p256.getPublicKey(privateKey, false);
  return { privateKey, publicKey };
}

export function encrypt(channel: SecureChannelType, message: string): string {
  const { block, iv } = getAESCipher(
    channel.PrivateKey,
    channel.ServerPublicKey
  );
  const enc = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(message),
    CryptoJS.enc.Hex.parse(block),
    {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  return enc.toString();
}

export function decrypt(channel: SecureChannelType, encrypted: string): string {
  const { block, iv } = getAESCipher(
    channel.PrivateKey,
    channel.ServerPublicKey
  );
  const dec = CryptoJS.AES.decrypt(encrypted, CryptoJS.enc.Hex.parse(block), {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return dec.toString(CryptoJS.enc.Utf8);
}

export function verifySecureChannel(channel: SecureChannelType): boolean {
  try {
    const decrypted = decrypt(channel, channel.Encrypted);
    return decrypted === channel.Message;
  } catch (error: any) {
    console.error("Secure Channel Verify Error: ", error);
    return false;
  }
}

function getAESCipher(privateKeyHex: string, publicKeyHex: string) {
  const privateKey = hexToBytes(privateKeyHex);
  const publicKey = hexToBytes(publicKeyHex);
  const shared = p256.getSharedSecret(privateKey, publicKey);

  const key = shared.slice(1, 17); // first 16 bytes
  const iv = shared.slice(17, 33); // next 16 bytes
  return { block: bytesToHex(key), iv: bytesToHex(iv) };
}

export async function secureChannelScenario(config: {
  API_WAAS_MYABCWALLET_URL: string;
  MW_MYABCWALLET_URL: string;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
}) {
  // Creating Secure Channel
  const secureChannelRes: SecureChannelType = await createSecureChannel(config);
  console.log("Secure Channel Created: ", secureChannelRes);

  // Verifying Secure Channel
  const verifyResult: boolean = verifySecureChannel(secureChannelRes);
  console.log("Secure Channel Verify Result: ", verifyResult); // expected to be true

  // Encrypting and decrypting message using Secure Channel
  const message: string = "Hello, Bryan!";
  const encryptedMessage: string = encrypt(secureChannelRes, message);
  const decryptedMessage: string = decrypt(secureChannelRes, encryptedMessage);

  console.log("Message Encrypt Result: ", message === decryptedMessage); // expected to be true
}

/**
 * 랜덤 비밀번호 생성
 */
export const randomPassword = () => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return password;
};

/**
 * 암호화된 비밀번호 생성
 */
export const encryptedPassword = (secret: string) => {
  // 32바이트 키를 생성한 후, 앞 16바이트만 AES 128비트 키로 사용
  const key = CryptoJS.enc.Hex.parse(secret.substring(0, 32))
    .toString(CryptoJS.enc.Hex)
    .substring(0, 32); // 32자리 hex 중 앞의 16바이트만 사용
  const iv = CryptoJS.enc.Hex.parse(secret.substring(AES_KEY_LENGTH)); // 나머지를 IV로 사용

  // 암호화 수행
  const encrypted = CryptoJS.AES.encrypt(
    randomPassword(),
    CryptoJS.enc.Hex.parse(key),
    {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  // Base64 형식으로 변환
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
};
