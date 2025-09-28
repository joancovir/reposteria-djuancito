import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { Resena } from '../modelos/resena';

@Injectable({
  providedIn: 'root'
})
export class ResenaService {
  private apiUrl = 'http://localhost:8080/api/resenas';

  constructor(private http: HttpClient) { }

  getResenas(): Observable<Resena[]> {
    return this.http.get<Resena[]>(this.apiUrl);
  }
}