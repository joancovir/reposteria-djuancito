
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { Producto } from '../modelos/producto'; 

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  
  private apiUrl = 'http://localhost:8080/api/productos';
  private archivoUrl = 'http://localhost:8080/api/archivos';

  constructor(private http: HttpClient) { }

  
  subirImagen(archivo: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', archivo, archivo.name); 

    return this.http.post<{ url: string }>(`${this.archivoUrl}/upload`, formData).pipe(
        map(response => response.url) 
    );
  }


  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }
  getProductosPorCategoria(categoria: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/categoria/${categoria}`);
  }

  getProductosPersonalizables(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/personalizables`);
  }

  getProductosPredeterminados(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/predeterminados`);
  }
  
  getProductosPorNombre(termino: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/buscar/${termino}`);
  }


  crearProducto(producto: Omit<Producto, 'productoId'>): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  actualizarProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}