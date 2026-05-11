import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { RequestEncryptService } from '../core/services/request-encrypt.service';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * getCookieValue function.
 * @param {string} name - Cookie key.
 * @returns {string} Result.
 */
function getCookieValue(name: string): string {
  if (typeof document === 'undefined') {
    return '';
  }

  const encodedName = `${encodeURIComponent(name)}=`;
  const cookie = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(encodedName));

  return cookie ? decodeURIComponent(cookie.substring(encodedName.length)) : '';
}

/**
 * isPlainJsonBody function.
 * @param {*} body - Request body.
 * @returns {boolean} Result.
 */
function isPlainJsonBody(body: unknown): boolean {
  if (!body || typeof body !== 'object') {
    return false;
  }

  if (body instanceof FormData) return false;
  if (body instanceof Blob) return false;
  if (body instanceof ArrayBuffer) return false;
  return true;
}

/**
 * requestSecurityInterceptor function.
 * @param {*} req - Parameter.
 * @param {*} next - Parameter.
 * @returns {*} Result.
 */
export const requestSecurityInterceptor: HttpInterceptorFn = (req, next) => {
  const encryptService = inject(RequestEncryptService);
  const method = String(req.method || '').toUpperCase();
  const isMutating = MUTATING_METHODS.has(method);

  let secureReq = req;
  const headers: Record<string, string> = {};

  if (isMutating) {
    const csrfCookieValue = getCookieValue('csrfToken');
    if (csrfCookieValue) {
      headers['x-csrf-token'] = csrfCookieValue;
    }
  }

  if (
    isMutating &&
    isPlainJsonBody(req.body) &&
    !encryptService.isEncryptedRequest(req.body)
  ) {
    secureReq = secureReq.clone({
      body: encryptService.encrypt(req.body),
      setHeaders: {
        ...headers,
        'x-request-encryption': 'v1',
      },
    });
    return next(secureReq);
  }

  if (Object.keys(headers).length > 0) {
    secureReq = secureReq.clone({ setHeaders: headers });
  }

  return next(secureReq);
};
