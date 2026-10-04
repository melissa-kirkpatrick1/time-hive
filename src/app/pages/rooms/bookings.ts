import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

interface Booking {
  id: string;
  room: string;
  building: string;
  start: Date;
  minutes: number;
}

/**
 * Local state only — there's no bookings endpoint yet. Holding the list in a
 * signal here keeps the shape of the eventual API visible without pretending
 * the data is real: a refresh clears it, which is the honest behaviour.
 */
@Component({
  selector: 'app-bookings',
  imports: [DatePipe, ButtonModule, RouterLink],
  template: `
    <header class="page-head">
      <h1>My bookings</h1>
      <p>Rooms you're holding today. Bookings clear when the page reloads.</p>
    </header>

    @if (bookings().length) {
      <ul class="list">
        @for (booking of bookings(); track booking.id) {
          <li>
            <span class="when">{{ booking.start | date: 'HH:mm' }}</span>
            <span class="what">
              <span class="room">{{ booking.room }}</span>
              <span class="where">{{ booking.building }}</span>
            </span>
            <span class="dur">{{ booking.minutes }} min</span>
            <p-button
              label="Release"
              severity="secondary"
              [text]="true"
              size="small"
              (onClick)="release(booking.id)"
            />
          </li>
        }
      </ul>
    } @else {
      <div class="blank">
        <p>You're not holding any rooms.</p>
        <p><a routerLink="/rooms">See what's free</a></p>
      </div>
    }
  `,
  styles: `
    .list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .list li {
      display: grid;
      grid-template-columns: 4rem 1fr auto auto;
      align-items: center;
      gap: 1.25rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--line);
    }

    .when {
      font-family: var(--mono);
      font-variant-numeric: tabular-nums;
      font-size: 0.875rem;
    }

    .room {
      display: block;
      font-weight: 600;
      font-size: 0.9375rem;
    }

    .where {
      display: block;
      font-size: 0.8125rem;
      color: var(--muted);
    }

    .dur {
      font-family: var(--mono);
      font-size: 0.8125rem;
      color: var(--muted);
    }

    .blank {
      padding: 2rem 0;
      color: var(--muted);
    }

    .blank p {
      margin: 0 0 0.5rem;
    }
  `,
})
export class Bookings {
  protected readonly bookings = signal<Booking[]>([]);

  protected release(id: string): void {
    this.bookings.update((list) => list.filter((b) => b.id !== id));
  }
}
