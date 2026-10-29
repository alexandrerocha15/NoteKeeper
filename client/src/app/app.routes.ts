import { Routes } from '@angular/router';
import { isAnonymous, isAuthenticated } from './auth/guards/auth.guards';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [isAnonymous],
    loadComponent: () => import('./auth/login/login').then((m) => m.Login),
  },
  {
    path: 'cadastro',
    canActivate: [isAnonymous],
    loadComponent: () => import('./auth/cadastro/cadastro').then((m) => m.Cadastro),
  },
  {
    path: '',
    loadComponent: () => import('./layout/principal/principal').then((m) => m.Principal),
    canActivate: [isAuthenticated],
    canActivateChild: [isAuthenticated],
    children: [
      {
        path: '',
        redirectTo: 'notas',
        pathMatch: 'full',
      },
      {
        path: 'notas',
        loadComponent: () => import('./notas/listagem/listagem').then((m) => m.Listagem),
      },
      {
        path: 'categorias',
        loadComponent: () =>
          import('./categorias/listagem/listagem').then((m) => m.Listagem),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'notas',
  },
];
