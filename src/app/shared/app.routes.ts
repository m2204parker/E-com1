import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('@features/collection/collection').then((m) => m.Collection),
  },
  {
    path: 'collections/new-arrivals-view-all',
    loadComponent: () =>
      import('@features/collection/collection').then((m) => m.Collection),
  },
  { path: '**', redirectTo: '' },
];
