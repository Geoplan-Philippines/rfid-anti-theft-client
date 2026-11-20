import { Routes } from '@angular/router';

export const STORES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./stores').then((m) => m.Stores),
  },
];
