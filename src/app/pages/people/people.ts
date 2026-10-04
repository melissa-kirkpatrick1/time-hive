import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';

import { IntranetService } from '../../core/intranet.service';
import { Person } from '../../core/models';

@Component({
  selector: 'app-people',
  imports: [FormsModule, TableModule, InputTextModule, SelectModule, TagModule],
  templateUrl: './people.html',
  styleUrl: './people.css',
})
export class People {
  private readonly data = inject(IntranetService);

  protected readonly people = toSignal(this.data.people(), {
    initialValue: [] as Person[],
  });

  protected readonly query = signal('');
  protected readonly department = signal<string | null>(null);

  /** Built from the data rather than hardcoded, so new departments appear on their own. */
  protected readonly departments = computed(() => {
    const names = [...new Set(this.people().map((p) => p.department))].sort();
    return names.map((name) => ({ label: name, value: name }));
  });

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const dept = this.department();

    return this.people().filter((p) => {
      if (dept && p.department !== dept) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.extension.includes(q) ||
        p.email.toLowerCase().includes(q)
      );
    });
  });

  protected clear(): void {
    this.query.set('');
    this.department.set(null);
  }
}
