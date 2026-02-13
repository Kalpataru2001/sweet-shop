import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 🟢 WAIT for Supabase to check the session
  const isAuthenticated = await authService.checkAuth();

  if (isAuthenticated) {
    return true; // You may pass
  } else {
    // Redirect to the correct login route
    return router.createUrlTree(['/admin/login']);
  }
};