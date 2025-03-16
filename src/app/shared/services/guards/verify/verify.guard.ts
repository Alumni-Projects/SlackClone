import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth-service/auth.service';

export const verifyGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getUser();

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  if (user.emailVerified) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
