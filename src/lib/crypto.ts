import CryptoJS from 'crypto-js';

// Use a fixed key for obfuscation since the goal is just to hide from casual network tab inspection
const SECRET_KEY = process.env.NEXT_PUBLIC_OBFUSCATION_KEY || 'sonata-obfuscation-key-123!@#';

export function encryptPayload(data: any): string {
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
}

export function decryptPayload(encryptedString: string): any {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedString, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Failed to decrypt payload', error);
    return null;
  }
}
