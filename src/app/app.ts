import { Component, OnInit, computed, inject, signal } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';

import { AuthService } from './core/auth.service';

interface SubPage {
  path: string;
  label: string;
  /** True for the section's landing page, whose path is a prefix of its siblings. */
  exact?: boolean;
}

interface Section {
  path: string;
  label: string;
  role?: string;
  /** Empty means the section is a single page and gets no side rail. */
  children: SubPage[];
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);

  protected readonly menuOpen = signal(false);

  private readonly sections: Section[] = [
    { path: '/', label: 'Today', children: [] },
    {
      path: '/people',
      label: 'People',
      children: [
        { path: '/people', label: 'Directory', exact: true },
        { path: '/people/departments', label: 'Departments' },
      ],
    },
    {
      path: '/rooms',
      label: 'Rooms',
      children: [
        { path: '/rooms', label: 'Availability', exact: true },
        { path: '/rooms/bookings', label: 'My bookings' },
      ],
    },
    {
      path: '/admin',
      label: 'Admin',
      role: 'INTRANET_ADMIN',
      children: [
        { path: '/admin', label: 'Overview', exact: true },
        { path: '/admin/notices', label: 'Notices' },
      ],
    },
  ];

  /**
   * router.url is a plain property, so it won't re-render anything on its own.
   * Mirroring it into a signal on each NavigationEnd is what makes the side rail
   * track navigation, including back/forward and a directly typed URL.
   */
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  protected readonly visibleSections = computed(() =>
    this.sections.filter((s) => !s.role || this.auth.hasRole(s.role)),
  );

  /**
   * Longest path first, so '/people/departments' matches People instead of
   * falling through to the '/' catch-all.
   */
  protected readonly activeSection = computed<Section | null>(() => {
    const current = this.url().split('?')[0];
    const candidates = [...this.visibleSections()].sort(
      (a, b) => b.path.length - a.path.length,
    );

    return (
      candidates.find((section) =>
        section.path === '/'
          ? current === '/'
          : current === section.path || current.startsWith(section.path + '/'),
      ) ?? null
    );
  });

  /** Drives whether the rail renders at all. Sections without sub-pages get none. */
  protected readonly subPages = computed(() => this.activeSection()?.children ?? []);

  ngOnInit(): void {
    // Cognito always returns to the app root, so restore the deep link the user
    // originally asked for.
    const returnTo = this.auth.takeReturnTo();
    if (returnTo && returnTo !== window.location.pathname) {
      void this.router.navigateByUrl(returnTo);
    }
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected signOut(): void {
    this.auth.logout();
  }
}
