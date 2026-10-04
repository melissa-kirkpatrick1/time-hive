import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Announcement, Person, Room } from './models';

/**
 * Reference data that barely changes within a session, so each stream is cached
 * with shareReplay. The directory in particular is read on nearly every page —
 * refetching it per navigation is wasted traffic.
 *
 * Swap shareReplay for a plain get if you add anything that mutates.
 */
@Injectable({ providedIn: 'root' })
export class IntranetService {
  private readonly http = inject(HttpClient);

  private announcements$?: Observable<Announcement[]>;
  private people$?: Observable<Person[]>;
  private rooms$?: Observable<Room[]>;

  announcements(): Observable<Announcement[]> {
    this.announcements$ ??= this.http
      .get<Announcement[]>('/api/announcements')
      .pipe(shareReplay({ bufferSize: 1, refCount: false }));
    return this.announcements$;
  }

  people(): Observable<Person[]> {
    this.people$ ??= this.http
      .get<Person[]>('/api/people')
      .pipe(shareReplay({ bufferSize: 1, refCount: false }));
    return this.people$;
  }

  rooms(): Observable<Room[]> {
    this.rooms$ ??= this.http
      .get<Room[]>('/api/rooms')
      .pipe(shareReplay({ bufferSize: 1, refCount: false }));
    return this.rooms$;
  }
}
