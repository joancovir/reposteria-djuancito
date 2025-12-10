import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from '../../../src/environments/environment';

export interface OpcionGarantia {
  id: number;
  porcentaje: number;
  descripcion: string;
  activo: boolean;
  esPrincipal?: boolean;
}

@Injectable({ providedIn: 'root' })
export class GarantiaService {

private api = environment.apiUrl + '/config'; 

  private opciones = new BehaviorSubject<number[]>([]);
  opciones$ = this.opciones.asObservable();

  private seleccionado = new BehaviorSubject<number>(50);
  seleccionado$ = this.seleccionado.asObservable();

  constructor(private http: HttpClient) {
    this.cargarOpciones();           
    this.cargarGarantiaSeleccionada(); 
  }

  private cargarOpciones() {
    this.http.get<number[]>(`${this.api}/garantias`).subscribe({
      next: (opcs) => this.opciones.next(opcs),
      error: () => this.opciones.next([30, 50, 70])
    });
  }

  private cargarGarantiaSeleccionada() {
    this.http.get<number>(`${this.api}/garantia/actual`).subscribe({
      next: (p) => this.seleccionado.next(p),
      error: () => this.seleccionado.next(50)
    });
  }

  obtenerOpciones(): Observable<number[]> {
    return this.opciones$;
  }

  obtener(): Observable<number> {
    return this.seleccionado$;
  }

  seleccionar(porcentaje: number) {
    this.seleccionado.next(porcentaje);
  }

  obtenerTodas(): Observable<OpcionGarantia[]> {
    return this.http.get<OpcionGarantia[]>(`${this.api}/garantias/admin`);
  }

  crear(opcion: OpcionGarantia): Observable<OpcionGarantia> {
    return this.http.post<OpcionGarantia>(`${this.api}/garantias`, opcion);
  }

  actualizar(id: number, opcion: OpcionGarantia): Observable<OpcionGarantia> {
    return this.http.put<OpcionGarantia>(`${this.api}/garantias/${id}`, opcion);
  }

  toggleActivo(id: number): Observable<OpcionGarantia> {
    return this.http.patch<OpcionGarantia>(`${this.api}/garantias/${id}/toggle`, {});
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/garantias/${id}`);
  }

  //  establecer como principal (y recarga todo automáticamente)
  establecerPrincipal(id: number): Observable<any> {
    return this.http.patch(`${this.api}/garantias/${id}/principal`, {}).pipe(
      // Después de establecerla, recargamos todo para que el carrito también se entere
      map(() => {
        this.cargarOpciones();
        this.cargarGarantiaSeleccionada();
      })
    );
  }
}
