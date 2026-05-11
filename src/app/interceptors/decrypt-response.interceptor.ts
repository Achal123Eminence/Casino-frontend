import {
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { inject } from '@angular/core';
import {
  ResponseDecryptService,
  EncryptedResponsePayload,
} from '../core/services/response-decrypt.service';

/**
 * Intercepts HTTP responses from the API gateway. If the body is in the
 * encrypted format (data.encryptedKey, data.iv, data.encryptedData), decrypts
 * it and replaces the body with the decrypted JSON.
 */
export const decryptResponseInterceptor: HttpInterceptorFn = (req, next) => {
  const decryptService = inject(ResponseDecryptService);
  const reqWithEncryption = req.clone({
    setHeaders: { 'x-response-encryption': 'v2' },
  });

  return next(reqWithEncryption).pipe(
    map((event) => {
      if (
        event instanceof HttpResponse &&
        event.body &&
        decryptService.isEncrypted(event.body)
      ) {
        try {
          const decrypted = decryptService.decrypt(
            event.body as EncryptedResponsePayload
          );
          return event.clone({ body: decrypted });
        } catch (err) {
          console.error('[decryptResponseInterceptor] Decryption failed:', err);
          return event;
        }
      }
      return event;
    })
  );
};
