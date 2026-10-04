import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-denied',
  imports: [RouterLink],
  template: `
    <header class="page-head">
      <h1>You don't have access to this page</h1>
      <p>
        You're signed in, but your account isn't in the group this section
        requires. Ask People Operations to add you to
        <code>intranet-admin</code>, then sign out and back in so the change
        reaches your session.
      </p>
    </header>

    <p><a routerLink="/">Back to Today</a></p>
  `,
})
export class Denied {}
