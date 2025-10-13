import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Adicional } from '../modelos/adicional';

@Injectable({
  providedIn: 'root'
})
export class AdicionalService {
  private apiUrl = 'http://localhost:8080/api/adicionales';
  constructor(private http: HttpClient) { }
  getAdicionales(): Observable<Adicional[]> {
    return this.http.get<Adicional[]>(this.apiUrl);
  }
}