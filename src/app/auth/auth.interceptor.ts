import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpResponse,
  HttpContextToken,
} from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { inject, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

interface ApiResponse {
  type?: string;
  message?: string;
  title?: string;
}

export const SKIP_UNAUTHORIZED_REDIRECT = new HttpContextToken<boolean>(() => false);

let isUnauthorizedRedirectInProgress = false;

/**
 * shouldSkipUnauthorizedHandling function.
 * @param {*} url - Request URL.
 * @returns {boolean} Result.
 */
function shouldSkipUnauthorizedHandling(url: string): boolean {
  return (
    url.includes('/auth/login') ||
    url.includes('/auth/verify-otp') ||
    url.includes('/auth/logout') ||
    url.includes('/captcha/')
  );
}

/**
 * authInterceptor function.
 * @param {*} req - Parameter.
 * @param {*} next - Parameter.
 * @returns {*} Result.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const ngZone = inject(NgZone);
  const toastr = inject(ToastrService);

  const authReq = req.clone({ withCredentials: true });
  const skipRedirect = req.context.get(SKIP_UNAUTHORIZED_REDIRECT);

  return next(authReq).pipe(
    tap((event) => {
      if (skipRedirect) return;

      if (event instanceof HttpResponse) {
        const responseBody = event.body as ApiResponse;
        if (
          responseBody?.type === 'error' &&
          responseBody?.message === 'Invalid Token' &&
          !isUnauthorizedRedirectInProgress &&
          !shouldSkipUnauthorizedHandling(req.url)
        ) {
          isUnauthorizedRedirectInProgress = true;
          ngZone.run(() => authService.redirectToLogin());
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      const backendKey = String(
        error?.error?.key ??
        error?.error?.data?.key ??
        ''
      ).trim().toLowerCase();
      const backendMessage = String(
        error?.error?.message ??
        error?.error?.data?.message ??
        ''
      ).trim();

      if (
        error.status === 401 &&
        (backendKey === 'inactivity_timeout' || backendKey === 'login_max_age_exceeded') &&
        backendMessage
      ) {
        ngZone.run(() => toastr.error(backendMessage, 'Error'));
      }

      if (
        error.status === 401 &&
        router.url !== '/login'
      ) {
        isUnauthorizedRedirectInProgress = true;
        ngZone.run(() => authService.redirectToLogin());
      }
      return throwError(() => error);
    })
  );
};
