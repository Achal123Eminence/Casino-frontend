import { Injectable } from '@angular/core';
import * as forge from 'node-forge';
const API_RESPONSE_PUBLIC_KEY = require('../constants/api-public-key.js');

interface EncryptedRequestPayload {
  data: {
    v: number;
    encryptedKey: string;
    iv: string;
    tag: string;
    encryptedData: string;
  };
}

@Injectable({ providedIn: 'root' })
export class RequestEncryptService {
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
   * isEncryptedRequest function.
   * @param {*} body - Parameter.
   * @returns {boolean} Result.
   */
  isEncryptedRequest(body: unknown): boolean {
    return (
      typeof body === 'object' &&
      body !== null &&
      'data' in body &&
      typeof (body as any).data?.encryptedKey === 'string' &&
      typeof (body as any).data?.iv === 'string' &&
      typeof (body as any).data?.tag === 'string' &&
      typeof (body as any).data?.encryptedData === 'string'
    );
  }

  /**
   * encrypt function.
   * @param {*} body - Parameter.
   * @returns {*} Result.
   */
  encrypt(body: unknown): EncryptedRequestPayload {
    const key = this.getPublicKey();
    const aesKey = forge.random.getBytesSync(32);
    const iv = forge.random.getBytesSync(12);
    const plaintext = forge.util.encodeUtf8(JSON.stringify(body));

    const cipher = forge.cipher.createCipher('AES-GCM', aesKey);
    cipher.start({ iv, tagLength: 128 });
    cipher.update(forge.util.createBuffer(plaintext));
    cipher.finish();

    const encryptedAesKey = (key as any).encrypt(aesKey, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
      mgf1: { md: forge.md.sha256.create() },
    });

    return {
      data: {
        v: 2,
        encryptedKey: forge.util.encode64(encryptedAesKey),
        iv: forge.util.encode64(iv),
        tag: forge.util.encode64(cipher.mode.tag.getBytes()),
        encryptedData: forge.util.encode64(cipher.output.getBytes()),
      },
    };
  }
}
