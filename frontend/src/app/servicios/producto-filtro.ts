// Ruta sugerida: src/app/servicios/producto-filtro.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { Producto } from '../modelos/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoFiltroService {
  private apiUrl = 'http://localhost:8080/api/productos';

  constructor(private http: HttpClient) { }

  // Obtiene solo productos personalizables (Tortas Personalizadas)
  obtenerPersonalizables(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/personalizables`);
  }

  // Obtiene solo productos predeterminados (Tortas Predeterminadas)
  obtenerPredeterminados(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/predeterminados`);
  }
}