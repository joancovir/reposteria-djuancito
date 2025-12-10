import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { Producto } from '../modelos/producto';
import { environment } from '../../../src/environments/environment'; 

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
private apiUrl = environment.apiUrl + '/productos'; 
  
  private apiRealizadosUrl = environment.apiUrl + '/productos-realizados'; 
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
