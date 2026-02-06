import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
 const router = inject(Router);
  
  const isLoggedIn = localStorage.getItem('admin_token') === 'logged_in';

  if (isLoggedIn) {
    return true; 
  } else {
    router.navigate(['/admin/login']);
    return false; 
  }
};
