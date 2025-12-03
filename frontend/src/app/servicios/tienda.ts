import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ConfigTienda {
  nombreTienda: string;
  direccion: string;
  referencia: string;
  telefono: string;
  googleMapsEmbed: string;
}

@Injectable({
  providedIn: 'root'
})
export class TiendaService {
  private apiUrl = 'http://localhost:8080/api/config-tienda';

  constructor(private http: HttpClient) {}

  obtenerConfig(): Observable<ConfigTienda> {
    return this.http.get<ConfigTienda>(this.apiUrl);
  }
}