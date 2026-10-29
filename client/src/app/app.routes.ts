import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login').then((m) => m.Login),
  },
  {
    path: 'cadastro',
    loadComponent: () =>
      import('./auth/cadastro/cadastro').then((m) => m.Cadastro),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/principal/principal').then((m) => m.Principal),
    children: [
      {
        path: '',
        redirectTo: 'notas',
        pathMatch: 'full',
      },
      {
        path: 'notas',
        loadComponent: () =>
          import('./notas/listagem/listagem').then((m) => m.Listagem),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'notas',
  },
];
