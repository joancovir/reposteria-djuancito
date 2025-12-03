
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resena } from '../modelos/resena'; 

export type EstadoResena = 'pendiente' | 'aprobado' | 'rechazado';

@Injectable({
  providedIn: 'root'
})
export class ResenaService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/resenas';

 
  getResenasPublicas(): Observable<any[]> { 
    return this.http.get<any[]>(this.apiUrl);
  }


  obtenerTodasLasResenasAdmin(): Observable<Resena[]> {
      return this.http.get<Resena[]>(`${this.apiUrl}/todas`);
  }


  actualizarEstadoResena(resenaId: number, nuevoEstado: EstadoResena): Observable<Resena> {
      const body = { estado: nuevoEstado };
      return this.http.put<Resena>(`${this.apiUrl}/${resenaId}/estado`, body);
  }
}

