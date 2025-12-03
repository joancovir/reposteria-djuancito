
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminDashboardStats {
  pedidosHoy: number;
  pendientes: number;
  resenasTotal: number; 
  pedidosTotales: number;
  ventasTotales: number;
  resenasPendientes: number;
  usuariosRegistrados: number;

}

export interface PedidoReciente {
  id: number;
  total: number;
  tiempoTranscurrido: string;
  estado: 'PENDIENTE PAGO' | 'EN PREPARACIÓN' | 'ENTREGADO' | 'CANCELADO';
}

export interface AdminDashboardStats {
  pedidosHoy: number;
  pendientes: number;
  resenasPendientes: number;
  resenasTotal: number;
  pedidosTotales: number;
  ventasTotales: number;
  usuariosRegistrados: number;
  ultimosPedidos: PedidoReciente[];
}

@Injectable({providedIn: 'root'})
export class DashboardService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/dashboard';


  obtenerEstadisticasAdmin(): Observable<AdminDashboardStats> {
    return this.http.get<AdminDashboardStats>(`${this.apiUrl}/admin`);
  }

  
}