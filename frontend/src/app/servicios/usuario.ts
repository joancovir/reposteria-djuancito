
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponseDTO } from '../modelos/authResponse';
import { Usuario } from '../modelos/usuario';
import { PasswordChangeDTO } from '../modelos/password-change-dto'; 
import { environment } from '../../../src/environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
private apiUrl = environment.apiUrl + '/usuarios'; 

  constructor(private http: HttpClient) { }

  registrar(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, usuario);
  }

  login(credenciales: any): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(`${this.apiUrl}/login`, credenciales);
  }

  obtenerMiPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/mi-perfil`);
  }

  actualizarMiPerfil(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/mi-perfil`, usuario);
  }

  cambiarPassword(passwordData: PasswordChangeDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cambiar-password`, passwordData);
  }
  obtenerTodosLosUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/todos`);
  }
  actualizarUsuarioPorAdmin(usuarioId: number, datos: any): Observable<Usuario> {
  return this.http.put<Usuario>(`${this.apiUrl}/${usuarioId}`, datos);
}
}


