import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TagModule } from 'primeng/tag';

import { IntranetService } from '../../core/intranet.service';
import { Person } from '../../core/models';

@Component({
  selector: 'app-departments',
  imports: [TagModule],
  template: `
    <header class="page-head">
      <h1>Departments</h1>
      <p>Everyone in the directory, grouped by the team they report into.</p>
    </header>

    @for (group of grouped(); track group.name) {
      <section class="dept">
        <h2>
          {{ group.name }}
          <span class="count">{{ group.members.length }}</span>
        </h2>

        <ul class="members">
          @for (person of group.members; track person.id) {
            <li>
              <a [href]="'mailto:' + person.email">{{ person.name }}</a>
              <span class="role">{{ person.title }}</span>
              <span class="ext">{{ person.extension }}</span>
              @if (person.outToday) {
                <p-tag value="Away" severity="warn" />
              }
            </li>
          }
        </ul>
      </section>
    } @empty {
      <p class="empty">The directory is still loading.</p>
    }
  `,
  styles: `
    .dept {
      margin-bottom: 2.25rem;
    }

    h2 {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--muted);
      margin: 0 0 0.6rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--line);
    }

    .count {
      font-family: var(--mono);
      font-size: 0.75rem;
      color: var(--muted);
      border: 1px solid var(--line-strong);
      border-radius: 2px;
      padding: 0 0.3rem;
    }

    .members {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .members li {
      display: grid;
      grid-template-columns: 12rem 1fr 4rem auto;
      align-items: center;
      gap: 1rem;
      padding: 0.4rem 0;
    }

    .members a {
      color: var(--ink-text);
      text-decoration: none;
      border-bottom: 1px solid transparent;
      font-size: 0.9375rem;
    }

    .members a:hover {
      color: var(--signal);
      border-bottom-color: var(--signal);
    }

    .role {
      font-size: 0.875rem;
      color: var(--muted);
    }

    .ext {
      font-family: var(--mono);
      font-variant-numeric: tabular-nums;
      font-size: 0.8125rem;
      color: var(--muted);
    }

    .empty {
      color: var(--muted);
    }

    @media (max-width: 720px) {
      .members li {
        grid-template-columns: 1fr auto;
        gap: 0.25rem 0.75rem;
      }

      .role {
        grid-column: 1 / -1;
      }
    }
  `,
})
export class Departments {
  private readonly data = inject(IntranetService);
  private readonly people = toSignal(this.data.people());

  protected readonly grouped = computed(() => {
    const groups = new Map<string, Person[]>();
    for (const person of this.people() ?? []) {
      const list = groups.get(person.department) ?? [];
      list.push(person);
      groups.set(person.department, list);
    }

    return [...groups.entries()]
      .map(([name, members]) => ({
        name,
        members: [...members].sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });
}
