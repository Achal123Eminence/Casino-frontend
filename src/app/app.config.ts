import { ApplicationConfig, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { authInterceptor } from '../app/auth/auth.interceptor';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { AuthService } from './services/auth.service';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { NgxMaskModule } from 'ngx-mask';
import { fingerprintInterceptor } from './interceptors/fingerprint.interceptor';
import { decryptResponseInterceptor } from './interceptors/decrypt-response.interceptor';
import { requestDedupeInterceptor } from './interceptors/request-dedupe.interceptor';
import { requestSecurityInterceptor } from './interceptors/request-security.interceptor';
import {
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions
} from '@angular/router';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

/**
 * initApp function.
 * @param {*} authService - Parameter.
 * @returns {*} Result.
 */
export function initApp(authService: AuthService) {
  return () => authService.loadUserFromApi();
}

export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * provideRouter function.
     * @param {*} routes - Parameter.
     * @returns {*} Result.
     */
    provideRouter(routes,
      /**
       * withRouterConfig function.
       * @param {*} args - Parameter.
       * @param {*} args.onSameUrlNavigation - Parameter.
       * @returns {*} Result.
       */
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      /**
       * withInMemoryScrolling function.
       * @param {*} args - Parameter.
       * @param {*} args.scrollPositionRestoration - Parameter.
       * @param {*} args.anchorScrolling - Parameter.
       * @returns {*} Result.
       */
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withEnabledBlockingInitialNavigation(),
      /**
       * withViewTransitions function.
       * @returns {*} Result.
       */
      withViewTransitions()
    ),
    BsDatepickerModule.forRoot().providers!,
    /**
     * provideAnimations function.
     * @returns {*} Result.
     */
    provideAnimations(),
    /**
     * provideToastr function.
     * @param {*} args - Parameter.
     * @param {*} args.timeOut - Parameter.
     * @param {*} args.positionClass - Parameter.
     * @param {*} args.true - Parameter.
     * @param {*} args.false - Parameter.
     * @returns {*} Result.
     */
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true,
      tapToDismiss: false,
      preventDuplicates: true,
      enableHtml: true
    }),
    /**
     * provideHttpClient function.
     * @returns {*} Result.
     */
    provideHttpClient(withInterceptors([requestDedupeInterceptor, requestSecurityInterceptor, fingerprintInterceptor, decryptResponseInterceptor, authInterceptor])),
    importProvidersFrom(NgMultiSelectDropDownModule.forRoot()),
    NgxMaskModule.forRoot({
      showMaskTyped: false,
    }).providers!,
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [AuthService],
      multi: true
    }
  ],


};
