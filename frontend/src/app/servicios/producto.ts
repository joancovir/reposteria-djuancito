import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { Producto } from '../modelos/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  // La URL de tu endpoint en el backend
  private apiUrl = 'http://localhost:8080/api/productos';

  // Inyecta HttpClient para poder hacer llamadas
  constructor(private http: HttpClient) { }

  // El método ahora devuelve un Observable con una lista de productos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }
}