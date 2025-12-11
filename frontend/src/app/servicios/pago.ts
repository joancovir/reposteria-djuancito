// src/app/servicios/pago.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pago } from '../modelos/pago';
import { environment } from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  // CORRECTO: solo /api/pagos
  private apiUrl = `${environment.apiUrl}/pagos`;

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<Pago[]> {
    return this.http.get<Pago[]>(this.apiUrl);
  }

  // CORREGIDO: sin duplicar /api/pagos
  actualizarMetodo(pagoId: number, metodo: string): Observable<Pago> {
    return this.http.put<Pago>(`${this.apiUrl}/${pagoId}/metodo`, { metodo });
  }

  // CORREGIDO: envía el estado en minúsculas como espera el backend
  actualizarEstadoPago(pagoId: number, estado: 'validado' | 'rechazado'): Observable<Pago> {
    return this.http.put<Pago>(`${this.apiUrl}/${pagoId}/estado`, { estado });
  }
}
