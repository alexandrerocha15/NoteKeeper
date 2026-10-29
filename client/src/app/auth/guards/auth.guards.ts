import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../auth';

export const isAuthenticated: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.estaAutenticado()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

export const isAnonymous: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (!auth.estaAutenticado()) {
    return true;
  }

  return router.createUrlTree(['/notas']);
};
