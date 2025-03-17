import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@shared/services/auth-service/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getUser();

  if (user && user.emailVerified || user && user.isAnonymous) {
    return true;
  } else if (user && !user.emailVerified && !user.isAnonymous) {
    router.navigate(['/verify-email']);
    return false;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
