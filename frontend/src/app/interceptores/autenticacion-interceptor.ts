import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AutenticacionService } from '../servicios/autenticacion';

export const autenticacionInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AutenticacionService);
  const token = authService.obtenerToken(); // Necesitaremos crear este método

  // Si el token existe, clonamos la petición y le añadimos el header de autorización
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  // Si no hay token, simplemente dejamos pasar la petición original
  return next(req);
};