import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../servicios/autenticacion';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AutenticacionService);
  const router = inject(Router);

  if (authService.estaLogueado()) {
    return true; // Si está logueado, permite el acceso
  } else {
    // Si no está logueado, redirige a la página de login y niega el acceso
    router.navigate(['/iniciar-sesion']);
    return false;
  }
};