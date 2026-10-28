import { Routes } from '@angular/router';

export const TRANSACTION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./transactions').then((m) => m.Transactions),
  },
  {
    path: ':id',
    title: 'Sale · MUJI EAS',
    loadComponent: () => import('./transaction-detail').then((m) => m.TransactionDetail),
  },
];
