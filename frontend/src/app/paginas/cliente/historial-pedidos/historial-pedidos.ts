import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importa tus servicios y modelos
import { PedidoService } from '../../../servicios/pedido';
import { AutenticacionService } from '../../../servicios/autenticacion';
import { Pedido } from '../../../modelos/pedido';

@Component({
  selector: 'app-historial-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-pedidos.html',
  styleUrl: './historial-pedidos.css'
})
export class HistorialPedidos implements OnInit {

  listaDePedidos: Pedido[] = [];

  constructor(
    private PedidoService: PedidoService,
    private authService: AutenticacionService
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.obtenerUsuarioActual();
    if (usuario) {
      this.PedidoService.obtenerPedidosPorUsuario(usuario.usuarioId).subscribe(pedidos => {
        this.listaDePedidos = pedidos;
      });
    }
  }
}