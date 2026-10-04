import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';

import { AuthService } from '../../core/auth.service';
import { IntranetService } from '../../core/intranet.service';

@Component({
  selector: 'app-today',
  imports: [DatePipe, RouterLink, TagModule, SkeletonModule],
  templateUrl: './today.html',
  styleUrl: './today.css',
})
export class Today {
  private readonly data = inject(IntranetService);
  protected readonly auth = inject(AuthService);

  protected readonly today = new Date();

  // No initialValue: toSignal then yields `T | undefined`, and undefined means
  // "the request hasn't resolved yet". Passing `null` as initialValue doesn't
  // type-check, because initialValue has to be assignable to the stream's own
  // type and null isn't an Announcement[].
  private readonly announcements = toSignal(this.data.announcements());
  private readonly people = toSignal(this.data.people());

  protected readonly loading = computed(() => this.announcements() === undefined);

  /** Pinned items first, then newest. Sorts a copy — toSignal's array is shared. */
  protected readonly sorted = computed(() => {
    const items = this.announcements();
    if (!items) return [];
    return [...items].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.posted.localeCompare(a.posted);
    });
  });

  protected readonly outToday = computed(
    () => this.people()?.filter((p) => p.outToday) ?? [],
  );

  protected initials(name: string): string {
    const parts = name.split(/\s+/).filter(Boolean);
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  }

  protected severityFor(category: string): 'success' | 'warn' | 'info' | 'secondary' {
    switch (category) {
      case 'IT':
        return 'warn';
      case 'Benefits':
        return 'success';
      case 'Company':
        return 'info';
      default:
        return 'secondary';
    }
  }
}
