import { Injectable } from '@angular/core';
import * as forge from 'node-forge';
const API_RESPONSE_PUBLIC_KEY = require('../constants/api-public-key.js');

export interface EncryptedResponsePayload {
  data: {
    v?: number;
    encryptedKey: string;
    iv: string;
    tag?: string;
    encryptedData: string;
  };
}

/**
 * isEncryptedPayload function.
 * @param {*} body - Parameter.
 * @returns {*} Result.
 */
function isEncryptedPayload(body: unknown): body is EncryptedResponsePayload {
  return (
    typeof body === 'object' &&
    body !== null &&
    'data' in body &&
    typeof (body as EncryptedResponsePayload).data === 'object' &&
    typeof (body as EncryptedResponsePayload).data?.encryptedKey === 'string' &&
    typeof (body as EncryptedResponsePayload).data?.iv === 'string' &&
    typeof (body as EncryptedResponsePayload).data?.encryptedData === 'string'
  );
}

/**
 * Decrypts API response payload encrypted by the backend (api-gateway) using
 * hybrid RSA (public key) + AES-256-CBC. Uses the same public key that pairs
 * with the backend's private key.
 */
@Injectable({ providedIn: 'root' })
export class ResponseDecryptService {
  private publicKey: forge.pki.PublicKey | null = null;

  /**
   * getPublicKey function.
   * @returns {*} Result.
   */
  private getPublicKey(): forge.pki.PublicKey {
    if (!this.publicKey) {
      this.publicKey = forge.pki.publicKeyFromPem(API_RESPONSE_PUBLIC_KEY);
    }
    return this.publicKey;
  }

  /**
   * isEncrypted function.
   * @param {*} body - Parameter.
   * @returns {*} Result.
   */
  isEncrypted(body: unknown): boolean {
    return isEncryptedPayload(body);
  }

  /**
   * decrypt function.
   * @param {*} body - Parameter.
   * @returns {*} Result.
   */
  decrypt(body: EncryptedResponsePayload): unknown {
    const { encryptedKey, iv, tag, encryptedData } = body.data;
    const key = this.getPublicKey();

    const encryptedKeyBytes = forge.util.decode64(encryptedKey);
    const ivBytes = forge.util.decode64(iv);

    // Low-level RSA public decrypt (encrypted with backend's private key, PKCS#1 v1.5 padding)
    const aesKeyBytes = (forge.pki.rsa as any).decrypt(
      encryptedKeyBytes,
      key,
      true,  // use public key
      true   // decode PKCS#1 v1.5 padding
    );

    // v2 payload: AES-256-GCM with auth tag.
    if (tag) {
      const decipher = forge.cipher.createDecipher('AES-GCM', aesKeyBytes);
      decipher.start({
        iv: ivBytes,
        tagLength: 128,
        tag: forge.util.createBuffer(forge.util.decode64(tag)),
      });
      decipher.update(
        forge.util.createBuffer(forge.util.decode64(encryptedData))
      );
      const ok = decipher.finish();
      if (!ok) {
        throw new Error('AES-GCM decryption failed');
      }
      return JSON.parse(decipher.output.toString()) as unknown;
    }

    // v1 backward compatibility: AES-CBC without tag.
    const decipher = forge.cipher.createDecipher('AES-CBC', aesKeyBytes);
    decipher.start({ iv: ivBytes });
    decipher.update(
      forge.util.createBuffer(forge.util.decode64(encryptedData))
    );
    const ok = decipher.finish();
    if (!ok) {
      throw new Error('AES decryption failed');
    }
    const decryptedUtf8 = decipher.output.toString();
    return JSON.parse(decryptedUtf8) as unknown;
  }
}
