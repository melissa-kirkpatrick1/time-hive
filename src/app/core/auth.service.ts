import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CurrentUser } from './models';

type Status = 'unknown' | 'authenticated' | 'anonymous';

const RETURN_TO = 'intranet.returnTo';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly _user = signal<CurrentUser | null>(null);
  private readonly _status = signal<Status>('unknown');

  readonly user = this._user.asReadonly();
  readonly status = this._status.asReadonly();

  readonly isAuthenticated = computed(() => this._status() === 'authenticated');

  readonly displayName = computed(() => {
    const u = this._user();
    return u?.name ?? u?.email ?? u?.username ?? '';
  });

  /** Two letters for the avatar. Falls back to the email's first character. */
  readonly initials = computed(() => {
    const name = this.displayName();
    const parts = name.split(/[\s.@]+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  });

  hasRole(role: string): boolean {
    return this._user()?.roles.includes(role) ?? false;
  }

  /** A 401 is the normal "not signed in" answer, not an error worth surfacing. */
  load(): Observable<CurrentUser | null> {
    return this.http.get<CurrentUser>('/api/me').pipe(
      tap((user) => {
        this._user.set(user);
        this._status.set('authenticated');
      }),
      catchError(() => {
        this._user.set(null);
        this._status.set('anonymous');
        return of(null);
      }),
    );
  }

  /** Only queries once. Keeps guards from re-checking on every route change. */
  ensureLoaded(): Observable<CurrentUser | null> {
    return this._status() === 'unknown' ? this.load() : of(this._user());
  }

  markAnonymous(): void {
    this._user.set(null);
    this._status.set('anonymous');
  }

  /**
   * Must be a full page navigation. The browser has to follow the redirect to
   * Cognito's hosted UI; fetch would die on the cross-origin hop.
   */
  login(returnTo: string = window.location.pathname + window.location.search): void {
    sessionStorage.setItem(RETURN_TO, returnTo);
    window.location.href = '/oauth2/authorization/cognito';
  }

  takeReturnTo(): string | null {
    const value = sessionStorage.getItem(RETURN_TO);
    sessionStorage.removeItem(RETURN_TO);
    return value;
  }

  /**
   * POST clears the Spring session; the response carries Cognito's logout URL,
   * which we navigate to so the Cognito session cookie goes too. Skip that and
   * the next login silently signs the same user back in with no prompt.
   */
  logout(): void {
    this.http
      .post<{ logoutUrl: string }>('/logout', {}, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .pipe(
        map((res) => res.logoutUrl),
        catchError(() => of('/')),
      )
      .subscribe((url) => {
        this.markAnonymous();
        window.location.href = url;
      });
  }
}
