import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { Temporada } from '../modelos/temporada'; 

@Injectable({
  providedIn: 'root'
})
export class TemporadaService {
  private apiUrl = 'http://localhost:8080/api/temporada'; 

  constructor(private http: HttpClient) { }

  getTemporadasActivas(): Observable<Temporada[]> {
    return this.http.get<Temporada[]>(`${this.apiUrl}/activas`);
  }
  
  obtenerTodasLasTemporadas(): Observable<Temporada[]> {
    return this.http.get<Temporada[]>(`${this.apiUrl}/todas`);
  }
  
  crearOActualizarTemporada(temporada: Temporada): Observable<Temporada> {
    return this.http.post<Temporada>(this.apiUrl, temporada);
  }
}