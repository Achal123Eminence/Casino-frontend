import {
  HttpEvent,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { finalize, shareReplay, tap } from 'rxjs/operators';

const inFlightRequests = new Map<string, Observable<HttpEvent<unknown>>>();
const responseCache = new Map<string, HttpResponse<unknown>>();

function isDedupableRequest(method: string, url: string): boolean {
  if (method === 'GET') return true;
  // `user-details` is called during bootstrap and login flow; dedupe it as well.
  return method === 'POST' && url.includes('/user/user-details');
}

function requestKey(method: string, url: string, body: unknown): string {
  const normalizedBody = body ? JSON.stringify(body) : '';
  return `${method}|${url}|${normalizedBody}`;
}

export const requestDedupeInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isDedupableRequest(req.method, req.urlWithParams)) {
    return next(req);
  }

  const key = requestKey(req.method, req.urlWithParams, req.body);

  const cached = responseCache.get(key);
  if (cached) {
    return of(cached.clone());
  }

  const pending = inFlightRequests.get(key);
  if (pending) {
    return pending;
  }

  const shared$ = next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        responseCache.set(key, event.clone());
        // Tiny TTL cache for bursty duplicate calls.
        setTimeout(() => responseCache.delete(key), 750);
      }
    }),
    finalize(() => inFlightRequests.delete(key)),
    shareReplay(1)
  );

  inFlightRequests.set(key, shared$);
  return shared$;
};
