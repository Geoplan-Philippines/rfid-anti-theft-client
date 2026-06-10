import { Routes } from '@angular/router';

export const ALARM_EVENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./alarm-events').then((m) => m.AlarmEvents),
  },
];
