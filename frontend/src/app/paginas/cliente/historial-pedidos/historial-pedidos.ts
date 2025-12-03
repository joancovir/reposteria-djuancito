import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PedidoService } from '../../../servicios/pedido';
import { AutenticacionService } from '../../../servicios/autenticacion';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-historial-pedidos',
  standalone: true,
  imports: [CommonModule,RouterLink],
  providers: [DatePipe],
  templateUrl: './historial-pedidos.html',
  styleUrls: ['./historial-pedidos.css']
})
export class HistorialPedidos implements OnInit {
  listaDePedidos: any[] = [];
  isLoading = true;
  pedidoSeleccionado: any = null;

  constructor(
    private pedidoService: PedidoService,
    private authService: AutenticacionService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.obtenerUsuarioActual();
    if (usuario?.usuarioId) {
      this.pedidoService.obtenerPedidosPorUsuario(usuario.usuarioId).subscribe({
        next: (pedidos) => {
          this.listaDePedidos = pedidos;
          this.isLoading = false;
        },
        error: () => {
          alert('Error al cargar pedidos');
          this.isLoading = false;
        }
      });
    }
  }

  verDetalle(pedido: any) {
    this.pedidoSeleccionado = pedido;
    const modal = new (window as any).bootstrap.Modal(document.getElementById('modalDetalle'));
    modal.show();
  }

  // CÁLCULOS
  calcularItemsTotales(pedido: any): number {
    let total = 0;
    pedido.detalles?.forEach((d: any) => {
      total += d.cantidad;
      if (d.personalizacion) total += 1;
    });
    return total;
  }

  calcularSubtotalSinDescuento(pedido: any): number {
    return pedido.detalles?.reduce((sum: number, d: any) => 
      sum + (d.precioUnitario * d.cantidad), 0) || 0;
  }

  calcularTotalDescuentos(pedido: any): number {
    return pedido.detalles?.reduce((sum: number, d: any) => 
      sum + (d.descuentoAplicado || 0), 0) || 0;
  }

  calcularSubtotalProductos(pedido: any): number {
    return pedido.detalles?.reduce((sum: number, d: any) => sum + (d.subtotal || 0), 0) || 0;
  }

  calcularTotalPersonalizacion(pedido: any): number {
    return pedido.detalles?.reduce((sum: number, d: any) => 
      sum + (d.personalizacion?.costoAdicional || 0), 0) || 0;
  }

  obtenerNombrePromocion(promocionId: number): string {
    const promos: { [key: number]: string } = {
      1: '20% OFF en Tres Leches',
      2: 'Promo Navideña',
      3: 'Combo Navideño Familiar',
      4: 'Cupcakes Festivos 2x1',
      28: '20% OFF en Tres Leches',
      29: '2x1 en Alfajores de Maicena'
    };
    return promos[promocionId] || 'Promoción especial';
  }

  // ESTADOS
  getEstadoClass(estado: string): string {
    const e = (estado || '').toUpperCase();
    if (e.includes('PENDIENTE')) return 'bg-warning text-dark';
    if (e.includes('ACEPTADO') || e.includes('CONFIRMADO')) return 'bg-info text-white';
    if (e.includes('PREPARACION') || e.includes('CAMINO')) return 'bg-primary text-white';
    if (e.includes('ENTREGADO')) return 'bg-success text-white';
    if (e.includes('CANCELADO')) return 'bg-danger text-white';
    return 'bg-secondary text-white';
  }

  getEstadoPagoTexto(pedido: any): string {
    const pago = pedido.pagos?.[0];
    if (!pago) return "Sin pago registrado";
    if (pago.estado === 'validado' && pago.tipoPago === 'TOTAL') return "¡Pago completo recibido!";
    if (pago.estado === 'validado') return "Garantía recibida";
    return "Esperando confirmación de pago";
  }

  getEstadoPagoBadge(pedido: any): string {
    const pago = pedido.pagos?.[0];
    if (!pago) return "SIN PAGO";
    if (pago.estado === 'validado') return pago.tipoPago === 'TOTAL' ? "PAGADO" : "GARANTÍA";
    return "PENDIENTE";
  }

  getEstadoPagoClass(pedido: any): string {
    const pago = pedido.pagos?.[0];
    if (!pago) return "bg-secondary";
    if (pago.estado === 'validado') {
      return pago.tipoPago === 'TOTAL' ? "bg-success text-white" : "bg-info text-white";
    }
    return "bg-warning text-dark";
  }

  getDetallePago(pedido: any): string {
    const pago = pedido.pagos?.[0];
    if (!pago) return "";
    return `${pago.metodo?.toUpperCase() || 'Método'} ${pago.codigoOperacion ? '• Op: ' + pago.codigoOperacion : ''}`;
  }
}