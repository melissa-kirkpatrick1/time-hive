import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { IntranetService } from '../../core/intranet.service';

@Component({
  selector: 'app-notices',
  imports: [DatePipe, TableModule, TagModule],
  template: `
    <header class="page-head">
      <h1>Notices</h1>
      <p>
        Everything currently posted to Today. Editing isn't wired up yet — this
        reads the same endpoint the dashboard does.
      </p>
    </header>

    <p-table
      [value]="announcements() ?? []"
      styleClass="p-datatable-sm"
      responsiveLayout="stack"
      breakpoint="720px"
    >
      <ng-template #header>
        <tr>
          <th scope="col">Posted</th>
          <th scope="col">Title</th>
          <th scope="col">Category</th>
          <th scope="col">Author</th>
        </tr>
      </ng-template>

      <ng-template #body let-item>
        <tr>
          <td class="stamp">{{ item.posted | date: 'd MMM yyyy' }}</td>
          <td>
            {{ item.title }}
            @if (item.pinned) {
              <p-tag value="Pinned" severity="success" />
            }
          </td>
          <td>{{ item.category }}</td>
          <td>{{ item.author }}</td>
        </tr>
      </ng-template>

      <ng-template #emptymessage>
        <tr>
          <td colspan="4" class="empty">Nothing posted yet.</td>
        </tr>
      </ng-template>
    </p-table>
  `,
  styles: `
    .stamp {
      font-family: var(--mono);
      font-size: 0.8125rem;
      color: var(--muted);
      white-space: nowrap;
    }

    .empty {
      color: var(--muted);
      text-align: center;
      padding: 2rem 0;
    }
  `,
})
export class Notices {
  private readonly data = inject(IntranetService);
  protected readonly announcements = toSignal(this.data.announcements());
}
