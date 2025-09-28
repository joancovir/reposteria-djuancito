// Ruta sugerida: src/app/servicios/temporada.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { Producto } from '../modelos/producto'; // Importamos el modelo Producto

@Injectable({
  providedIn: 'root'
})
export class TemporadaService {
  // Define la URL del nuevo endpoint que creaste en Spring Boot
  private apiUrl = 'http://localhost:8080/api/temporada/productos-destacados'; 

  // Inyecta el módulo HttpClient
  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de productos que están activos en la temporada actual 
   * desde el endpoint del backend.
   */
  getProductosDestacados(): Observable<Producto[]> {
    // La respuesta de tu API es una lista de objetos Producto
    return this.http.get<Producto[]>(this.apiUrl);
  }
}