import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/auth.guard';

/**
 * Flat routes rather than nested children: the side rail is built from the
 * section config in app.ts, not from the router tree, so there's no parent
 * component needed just to host an outlet.
 *
 * Order matters only for the '**' catch-all, which stays last.
 */
export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/today/today').then((m) => m.Today),
    title: 'Today',
  },

  {
    path: 'people',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/people/people').then((m) => m.People),
    title: 'Directory',
  },
  {
    path: 'people/departments',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/people/departments').then((m) => m.Departments),
    title: 'Departments',
  },

  {
    path: 'rooms',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/rooms/rooms').then((m) => m.Rooms),
    title: 'Rooms',
  },
  {
    path: 'rooms/bookings',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/rooms/bookings').then((m) => m.Bookings),
    title: 'My bookings',
  },

  {
    path: 'admin',
    canActivate: [roleGuard('INTRANET_ADMIN')],
    loadComponent: () => import('./pages/admin/admin').then((m) => m.Admin),
    title: 'Admin',
  },
  {
    path: 'admin/notices',
    canActivate: [roleGuard('INTRANET_ADMIN')],
    loadComponent: () => import('./pages/admin/notices').then((m) => m.Notices),
    title: 'Notices',
  },

  {
    // Unguarded on purpose — a signed-in user without the group lands here, and
    // guarding it would loop them through login forever.
    path: 'denied',
    loadComponent: () => import('./pages/denied/denied').then((m) => m.Denied),
    title: 'Not authorized',
  },

  { path: '**', redirectTo: '' },
];
