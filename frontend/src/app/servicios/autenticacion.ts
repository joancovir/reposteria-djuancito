import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; 
import { Usuario } from '../modelos/usuario';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  constructor(private router: Router) { }

  guardarSesion(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  cerrarSesion(): void {
    localStorage.removeItem('jwt_token');
    this.router.navigate(['/']);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  estaLogueado(): boolean {
    const token = this.obtenerToken();
    return token !== null; 
  }
  // --- MÉTODO NUEVO Y CLAVE ---
  obtenerUsuarioActual(): Usuario | null {
  const token = this.obtenerToken();
  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      const usuario: Usuario = {
        usuarioId: decodedToken.usuarioId,
        nombre: decodedToken.nombre, 
        email: decodedToken.sub, 
        roles: decodedToken.roles
      };
      return usuario;
    } catch (error) {
      console.error("Error al decodificar el token", error);
      return null;
    }
  }
  return null;
}
}