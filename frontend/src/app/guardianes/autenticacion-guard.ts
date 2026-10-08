import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../servicios/autenticacion';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AutenticacionService);
  const router = inject(Router);

  if (!authService.estaLogueado()) {
    // Si no está logueado, lo manda al login.
    router.navigate(['/iniciar-sesion'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // --- LÓGICA DE ROLES CONSOLIDADA ---
  const usuario = authService.obtenerUsuarioActual();
  const rolesRequeridos: string[] = route.data['roles'] || [];

  // Si no se requiere ningún rol específico, permite.
  if (rolesRequeridos.length === 0) {
    return true;
  }

  // Verifica si el usuario tiene AL MENOS UNO de los roles requeridos
  const tieneRolRequerido = rolesRequeridos.some((reqRole: string) =>
    authService.userHasRole(reqRole)
  );

  if (tieneRolRequerido) {
    return true; // El usuario tiene el rol necesario.
  } else {
    // NO tiene el rol requerido. Redirige a la página por defecto del cliente.
    router.navigate(['/cliente/bienvenida']);
    return false;
  }
};