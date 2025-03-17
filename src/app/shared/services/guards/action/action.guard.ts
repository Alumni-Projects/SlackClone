import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const actionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const oobCode = route.queryParams['oobCode'];

  if (!oobCode) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
