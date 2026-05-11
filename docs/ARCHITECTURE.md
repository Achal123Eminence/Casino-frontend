# Frontend Architecture Reference

## Stack

- Angular 20 (standalone components + lazy routing)
- RxJS + HttpClient + interceptors
- Bootstrap/PrimeNG/NG Bootstrap UI libraries

## Core Runtime Flow

1. App bootstrap loads providers from `src/app/app.config.ts`.
2. `APP_INITIALIZER` triggers user bootstrap (`AuthService.loadUserFromApi`).
3. Every API call passes through:
   - fingerprint header interceptor
   - response decryption interceptor
   - auth/cookie interceptor

## Important folders

- `src/app/auth`: login/otp/recovery flows
- `src/app/features`: functional screens and feature modules
- `src/app/services`: API/domain services (`AuthService`, `DatahandlerService`)
- `src/app/interceptors`: cross-cutting request/response behavior
- `src/app/shared`: reusable components, pipes, directives

## API integration conventions

- Base URL from `src/app/environments/environment*.ts`
- Cookie-based auth (`withCredentials`)
- Encrypted response envelope support via `ResponseDecryptService`

## Suggested developer workflow

1. Update feature/service logic.
2. Add/update JSDoc comments.
3. Regenerate docs with Compodoc:

```bash
npm run docs:generate
```

4. Review output in `docs/compodoc`.

