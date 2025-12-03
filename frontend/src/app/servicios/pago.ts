import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pago } from '../modelos/pago';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  private apiUrl = 'http://localhost:8080/api/pagos';

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<Pago[]> {
    return this.http.get<Pago[]>(this.apiUrl);
  }

  actualizarEstadoPago(id: number, estado: string): Observable<Pago> {
    return this.http.put<Pago>(`${this.apiUrl}/${id}/estado`, { estado });
  }
}
