import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { IntranetService } from '../../core/intranet.service';
import { Room, RoomAvailability } from '../../core/models';

@Component({
  selector: 'app-rooms',
  imports: [ButtonModule, TagModule, ToastModule],
  providers: [MessageService],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css',
})
export class Rooms {
  private readonly data = inject(IntranetService);
  private readonly messages = inject(MessageService);

  protected readonly rooms = toSignal(this.data.rooms(), { initialValue: [] as Room[] });
  protected readonly onlyFree = signal(false);

  protected readonly visible = computed(() =>
    this.onlyFree() ? this.rooms().filter((r) => r.availability === 'free') : this.rooms(),
  );

  protected readonly freeCount = computed(
    () => this.rooms().filter((r) => r.availability === 'free').length,
  );

  /** Groups rooms under their building so the list reads like the floor plan. */
  protected readonly byBuilding = computed(() => {
    const groups = new Map<string, Room[]>();
    for (const room of this.visible()) {
      const list = groups.get(room.building) ?? [];
      list.push(room);
      groups.set(room.building, list);
    }
    return [...groups.entries()]
      .map(([building, rooms]) => ({ building, rooms }))
      .sort((a, b) => a.building.localeCompare(b.building));
  });

  protected label(availability: RoomAvailability): string {
    switch (availability) {
      case 'free':
        return 'Free now';
      case 'busy':
        return 'In use';
      case 'maintenance':
        return 'Out of service';
    }
  }

  protected severity(availability: RoomAvailability): 'success' | 'danger' | 'secondary' {
    switch (availability) {
      case 'free':
        return 'success';
      case 'busy':
        return 'danger';
      case 'maintenance':
        return 'secondary';
    }
  }

  /**
   * Placeholder for a real booking call. Wire this to POST /api/rooms/{id}/bookings
   * when the backend grows one — the CSRF header goes along automatically.
   */
  protected book(room: Room): void {
    this.messages.add({
      severity: 'success',
      summary: `${room.name} held for 30 minutes`,
      detail: 'Booking is not wired to the backend yet.',
      life: 4000,
    });
  }

  protected toggleFree(): void {
    this.onlyFree.update((v) => !v);
  }
}
