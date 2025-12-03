
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contacto } from '../modelos/contacto'; 

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/contacto'; 


  obtenerMiHistorial(): Observable<Contacto[]> {
    return this.http.get<Contacto[]>(`${this.apiUrl}/mi-historial`);
  }

  obtenerPorId(id: number): Observable<Contacto> {
    return this.http.get<Contacto>(`${this.apiUrl}/${id}`);
  }
  enviarMensaje(mensaje: any): Observable<Contacto> {
    return this.http.post<Contacto>(this.apiUrl, mensaje);
  }
  obtenerTodasLasConsultas(): Observable<Contacto[]> {
      return this.http.get<Contacto[]>(`${this.apiUrl}/todos`);
  }

  registrar(mensaje: Partial<Contacto>): Observable<Contacto> { 
    return this.http.post<Contacto>(this.apiUrl, mensaje);
  }
}