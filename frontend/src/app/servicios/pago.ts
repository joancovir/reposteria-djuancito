import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pago } from '../modelos/pago';
import { environment } from '../../../src/environments/environment'; // Asegúrate de que la ruta sea correcta
@Injectable({
  providedIn: 'root'
})
export class PagoService {

private apiUrl = environment.apiUrl + '/pagos'; 

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<Pago[]> {
    return this.http.get<Pago[]>(this.apiUrl);
  }

  actualizarEstadoPago(id: number, estado: string): Observable<Pago> {
    return this.http.put<Pago>(`${this.apiUrl}/${id}/estado`, { estado });
  }
}
