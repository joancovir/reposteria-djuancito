import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { Producto } from '../modelos/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:8080/api/productos';

  constructor(private http: HttpClient) { }

  // Obtiene TODOS los productos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }
getProductosPorCategoria(categoria: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/categoria/${categoria}`);
}
  // Obtiene solo productos personalizables
  getProductosPersonalizables(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/personalizables`);
  }

  // Obtiene solo productos predeterminados
  getProductosPredeterminados(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/predeterminados`);
  }
}