import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

/**
 * Catches the session expiring mid-visit. Spring returns a plain 401 for /api/**
 * rather than a redirect (see the exceptionHandling block in SecurityConfig), so
 * this is a reliable signal rather than an ambiguous CORS failure.
 *
 * /api/me is excluded: a 401 there is the expected "not signed in" answer and
 * AuthService.load already handles it. Reacting here too would bounce first-time
 * visitors to Cognito before they'd clicked anything.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !req.url.startsWith('/api/me')
      ) {
        auth.markAnonymous();
        auth.login();
      }
      return throwError(() => error);
    }),
  );
};
