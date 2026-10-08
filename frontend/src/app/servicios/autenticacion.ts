import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  sub: string;
  usuarioId: number;
  nombre: string;
  roles: any[]; 
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  constructor(private router: Router) { }

  guardarSesion(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  guardarUsuarioCompleto(usuario: any): void {
    localStorage.setItem('usuario_actual', JSON.stringify(usuario));
  }

  obtenerUsuarioCompleto(): any | null {
    const guardado = localStorage.getItem('usuario_actual');
    return guardado ? JSON.parse(guardado) : null;
  }

  obtenerToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  estaLogueado(): boolean {
    const token = this.obtenerToken();
    if (!token) return false;

    try {
      const payload: any = jwtDecode(token);
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch {
      return false;
    }
  }

  obtenerUsuarioActual(): any | null {
    // PRIMERO: intenta devolver el usuario completo
    const completo = this.obtenerUsuarioCompleto();
    if (completo) {
      return completo;
    }

    // SI NO HAY → usa el del token (solo básicos)
    const token = this.obtenerToken();
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        return {
          usuarioId: decoded.usuarioId,
          nombre: decoded.nombre,
          email: decoded.sub,
          roles: decoded.roles // Esto es un array de objetos [{rolId, nombre}]
        };
      } catch (error) {
        console.error("Error al decodificar token", error);
        this.cerrarSesion();
        return null;
      }
    }
    return null;
  }
  
  /**
   * Verifica si el usuario actual tiene la autoridad (rol) especificada.
   * Modificado para manejar un array de objetos de rol: [{rolId, nombre: 'ROLE_X'}]
   * La comprobación es insensible a mayúsculas/minúsculas.
   * @param roleName El nombre del rol a verificar sin el prefijo (ej: 'Administrador').
   * @returns true si el usuario tiene el rol, false en caso contrario.
   */
  userHasRole(roleName: string): boolean {
    const user = this.obtenerUsuarioActual();
    if (!user || !user.roles || !Array.isArray(user.roles)) {
      return false;
    }

    const cleanTarget = roleName.toUpperCase().replace(/^ROLE_/, '');

    return user.roles.some((r: any) => {
      const rawName = typeof r === 'string' ? r : (r?.nombre || '');
      const cleanName = String(rawName).toUpperCase().replace(/^ROLE_/, '');
      return cleanName === cleanTarget;
    });
  }

  cerrarSesion(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('usuario_actual');
    this.router.navigate(['/']);
  }
}