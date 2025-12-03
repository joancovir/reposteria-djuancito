import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../modelos/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  // CAMBIA ESTO CUANDO ESTÉS EN PRODUCCIÓN (Railway)
  private baseUrl = 'https://reposteria-djuancito-production.up.railway.app/api';

  // PARA PRUEBAS LOCALES (descomenta la de abajo y comenta la de arriba)
  // private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // SUBIR IMAGEN A CLOUDINARY (AHORA SÍ FUNCIONA)
  subirImagen(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/cloudinary/subir`, formData);
    // Devuelve: { url: "https://...", public_id: "reposteria-djuancito/xxx" }
  }

  // CRUD DE PRODUCTOS
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/productos`);
  }

  getProductosPorCategoria(categoria: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/productos/categoria/${categoria}`);
  }

  getProductosPersonalizables(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/productos/personalizables`);
  }

  getProductosPredeterminados(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/productos/predeterminados`);
  }

  getProductosPorNombre(termino: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/productos/buscar/${termino}`);
  }

  crearProducto(producto: any): Observable<Producto> {
    return this.http.post<Producto>(`${this.baseUrl}/productos`, producto);
  }

  actualizarProducto(id: number, producto: any): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/productos/${id}`, producto);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/productos/${id}`);
  }
}