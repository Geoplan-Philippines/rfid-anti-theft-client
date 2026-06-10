import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'registry' },
  {
    path: 'registry',
    title: 'Tag Registry · Anti-Theft Console',
    loadChildren: () =>
      import('./modules/tag-registry/tag-registry.routes').then((m) => m.TAG_REGISTRY_ROUTES),
  },
  {
    path: 'events',
    title: 'Alarm Events · Anti-Theft Console',
    loadChildren: () =>
      import('./modules/alarm-events/alarm-events.routes').then((m) => m.ALARM_EVENTS_ROUTES),
  },
  { path: '**', redirectTo: 'registry' },
];
