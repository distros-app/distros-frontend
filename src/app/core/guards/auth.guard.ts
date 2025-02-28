import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If the user is logged in, allow access
  if (authService.isLoggedIn) {
    return true;
  } else {
    // If not logged in and not already on the login page, navigate to login
    if (router.url !== '/login') {
      router.navigate(['/login']);
    }
    return false;
  }
};
