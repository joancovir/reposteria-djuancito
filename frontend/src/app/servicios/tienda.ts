import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../src/environments/environment'; 

export interface ConfigTienda {
  nombreTienda: string;
  direccion: string;
  referencia: string;
  telefono: string;
  latitud: number;
  longitud: number;
  googleMapsEmbed: string;
}

@Injectable({
  providedIn: 'root'
})
export class TiendaService {
private apiUrl = environment.apiUrl + '/config-tienda'; 

  constructor(private http: HttpClient) {}

  obtenerConfig(): Observable<ConfigTienda> {
    return this.http.get<ConfigTienda>(this.apiUrl);
  }
}
