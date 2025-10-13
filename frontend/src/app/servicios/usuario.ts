import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../modelos/usuario';
import { AuthResponseDTO } from '../modelos/authResponse'; 

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) { }

  registrar(usuario: any): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/registro`, usuario);
  }

login(credenciales: any): Observable<{ token: string }> { 
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credenciales);
}
}