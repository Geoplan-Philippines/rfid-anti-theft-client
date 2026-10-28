import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

/** Feature routes. No token sends the operator to the login page. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (auth.token()) {
    return true;
  }
  return inject(Router).createUrlTree(['/login']);
};

/** Login route only. A stored token goes to the registry. */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (auth.token()) {
    return inject(Router).createUrlTree(['/registry']);
  }
  return true;
};
