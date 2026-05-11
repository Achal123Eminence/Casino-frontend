import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { FingerprintService } from '../services/fingerprint.service';
import { from, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

let fingerprintCache: any = null; // ✅ cache inside interceptor

export const fingerprintInterceptor: HttpInterceptorFn = (req, next) => {
  const fingerprintService = inject(FingerprintService);

  if (!req.headers.has('x-fingerprint-components')) {
    if (fingerprintCache) {
      const cloned = req.clone({
        setHeaders: { 'x-fingerprint-components': JSON.stringify(fingerprintCache) }
      });
      return next(cloned);
    } else {
      return from(fingerprintService.collect()).pipe(
        switchMap(fp => {
          fingerprintCache = fp;
          const cloned = req.clone({
            setHeaders: { 'x-fingerprint-components': JSON.stringify(fp) }
          });
          return next(cloned);
        }),
        catchError(() => next(req))
      );
    }
  }

  return next(req);
};
