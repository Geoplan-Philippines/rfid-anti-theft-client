import { Routes } from '@angular/router';

export const TAG_REGISTRY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./tag-registry').then((m) => m.TagRegistry),
  },
];
