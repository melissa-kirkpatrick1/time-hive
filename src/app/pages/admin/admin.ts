import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-admin',
  imports: [ButtonModule, MessageModule],
  template: `
    <header class="page-head">
      <h1>Admin</h1>
      <p>
        Guarded twice: the route guard keeps this out of the nav, and
        <code>hasRole('INTRANET_ADMIN')</code> on the server enforces it. Only the
        second one is a security boundary.
      </p>
    </header>

    <section class="panel">
      <h2>Your groups</h2>
      <ul class="groups">
        @for (role of auth.user()?.roles ?? []; track role) {
          <li>{{ role }}</li>
        } @empty {
          <li class="none">No groups assigned</li>
        }
      </ul>
    </section>

    <section class="panel">
      <h2>Check the protected endpoint</h2>
      <p-button
        [label]="busy() ? 'Calling' : 'Call /api/admin/ping'"
        [loading]="busy()"
        size="small"
        (onClick)="ping()"
      />

      @if (result(); as message) {
        <p-message severity="success" styleClass="outcome">{{ message }}</p-message>
      }
      @if (error(); as message) {
        <p-message severity="error" styleClass="outcome">{{ message }}</p-message>
      }
    </section>
  `,
  styles: `
    .panel {
      padding: 1.25rem 0;
      border-top: 1px solid var(--line);
    }

    .panel h2 {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--muted);
      margin: 0 0 0.75rem;
    }

    .groups {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .groups li {
      font-family: var(--mono);
      font-size: 0.75rem;
      border: 1px solid var(--line-strong);
      border-radius: 2px;
      padding: 0.1rem 0.45rem;
    }

    .groups .none {
      border-style: dashed;
      color: var(--muted);
    }

    /* PrimeFlex isn't installed, so spacing utilities come from here. */
    :host ::ng-deep .outcome {
      margin-top: 0.9rem;
    }
  `,
})
export class Admin {
  private readonly http = inject(HttpClient);
  protected readonly auth = inject(AuthService);

  protected readonly result = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly busy = signal(false);

  /**
   * End-to-end check that the group mapping survived the whole trip:
   * Cognito group -> cognito:groups claim -> ROLE_ authority -> method security.
   */
  protected ping(): void {
    this.busy.set(true);
    this.result.set(null);
    this.error.set(null);

    this.http.get<{ status: string }>('/api/admin/ping').subscribe({
      next: (res) => {
        this.result.set(res.status);
        this.busy.set(false);
      },
      error: (err) => {
        this.error.set(
          err.status === 403
            ? 'The server rejected the call: your account is missing the intranet-admin group.'
            : `Request failed with ${err.status} ${err.statusText || ''}`.trim(),
        );
        this.busy.set(false);
      },
    });
  }
}
