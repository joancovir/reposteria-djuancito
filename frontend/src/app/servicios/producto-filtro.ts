import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { Producto } from '../modelos/producto';
export interface ProductoRealizado {
  realizadoId: number;
  nombre: string;
  descripcion?: string;
  imagenUrl: string;
  categoria?: string; 
  fechaRealizacion?: string; 
  destacado: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class ProductoFiltro {
  private apiUrl = 'http://localhost:8080/api/productos';
  private apiRealizadosUrl = 'http://localhost:8080/api/productos-realizados';

  constructor(private http: HttpClient) { }

  obtenerPersonalizables(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/personalizables`);
  }

  obtenerPredeterminados(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/predeterminados`);
  }

  obtenerProductosRealizados(): Observable<ProductoRealizado[]> {
    return this.http.get<ProductoRealizado[]>(this.apiRealizadosUrl);
  }
}