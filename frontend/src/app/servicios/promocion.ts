import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promocion } from '../modelos/promocion'; 

@Injectable({
  providedIn: 'root'
})
export class PromocionService {
  private apiUrl = 'http://localhost:8080/api/promociones'; 

  constructor(private http: HttpClient) { }

  getPromocionesActivas(): Observable<Promocion[]> {
    return this.http.get<Promocion[]>(`${this.apiUrl}/activas`);
  }

  getPromocionById(id: number): Observable<Promocion> {
    return this.http.get<Promocion>(`${this.apiUrl}/${id}`);
  }

  obtenerTodasLasPromociones(): Observable<Promocion[]> {
    return this.http.get<Promocion[]>(`${this.apiUrl}/todas`);
  }


  
  crearPromocion(promocion: Promocion): Observable<Promocion> {
    return this.http.post<Promocion>(this.apiUrl, promocion);
  }


  actualizarPromocion(id: number, promocion: Promocion): Observable<Promocion> {
    return this.http.put<Promocion>(`${this.apiUrl}/${id}`, promocion);
  }


  eliminarPromocion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}