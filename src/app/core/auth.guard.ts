import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

/**
 * Sends unauthenticated visitors to Cognito, remembering where they were headed.
 * Returns false after kicking off the redirect so the router stops routing while
 * the browser navigates away.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);

  return auth.ensureLoaded().pipe(
    map(() => {
      if (auth.isAuthenticated()) {
        return true;
      }
      auth.login(state.url);
      return false;
    }),
  );
};

/**
 * Requires a specific Cognito group. Signed-in users who lack it get the denied
 * page rather than another trip through login, which would just loop.
 *
 * Roles arrive already stripped of the ROLE_ prefix from /api/me, so a Cognito
 * group named "intranet-admin" is "INTRANET_ADMIN" here.
 */
export function roleGuard(role: string): CanActivateFn {
  return (_route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    return auth.ensureLoaded().pipe(
      map(() => {
        if (!auth.isAuthenticated()) {
          auth.login(state.url);
          return false;
        }
        return auth.hasRole(role) ? true : router.parseUrl('/denied');
      }),
    );
  };
}
