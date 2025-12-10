import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../modelos/pedido';
import { environment } from '../../../src/environments/environment'; 

import { 
  PedidoRequestDTO, 
  DetalleRequestDTO 
} from '../modelos/pedido-request-dto';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/pedidos'; 
  private entregaUrl = environment.apiUrl + '/entregas'; 

  obtenerPedidosPorUsuario(usuarioId: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  obtenerTodosLosPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/todos`);
  }

  actualizarEstadoPedido(pedidoId: number, nuevoEstado: string | EstadoPedido): Observable<Pedido> {
    const body = { estado: nuevoEstado };
    return this.http.put<Pedido>(`${this.apiUrl}/${pedidoId}/estado`, body);
  }
  
  eliminarPedido(pedidoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${pedidoId}`);
  }

  actualizarPedido(pedidoId: number, pedido: Partial<Pedido>): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/${pedidoId}`, pedido);
  }

  crearEntrega(entrega: any): Observable<any> {
    return this.http.post<any>(this.entregaUrl, entrega);
  }

  crear(dto: PedidoRequestDTO): Observable<any> {
    return this.http.post<any>(this.apiUrl, dto);
  }
}

export type EstadoPedido = 'pendiente' | 'aceptado' | 'en_preparacion' | 'entregado' | 'cancelado';
