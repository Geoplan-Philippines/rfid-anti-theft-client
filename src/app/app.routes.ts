import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Sign in · MUJI EAS',
    canActivate: [guestGuard],
    loadComponent: () => import('./modules/login/login').then((m) => m.Login),
  },
  { path: '', pathMatch: 'full', redirectTo: 'registry' },
  {
    path: 'registry',
    title: 'Tag Registry · MUJI EAS',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/tag-registry/tag-registry.routes').then((m) => m.TAG_REGISTRY_ROUTES),
  },
  {
    path: 'transactions',
    title: 'Transactions · MUJI EAS',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/transactions/transactions.routes').then((m) => m.TRANSACTION_ROUTES),
  },
  {
    path: 'events',
    title: 'Alarm Events · MUJI EAS',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/alarm-events/alarm-events.routes').then((m) => m.ALARM_EVENTS_ROUTES),
  },
  { path: '**', redirectTo: 'registry' },
];
