import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pedido } from '../../modelos/pedido';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Pago, EstadoPago } from '../../modelos/pago'; // Importa modelos de Pago
import { ModalGestionPago } from '../modal-gestion-pago/modal-gestion-pago';
import { PedidoService } from '../../servicios/pedido'; // Importa PedidoService
import { EstadoPedidoType } from '../../modelos/estado-pedido'; // Importa el tipo EstadoPedido
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-detalles-pedido',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './modal-detalles-pedido.html',
  styleUrl: './modal-detalles-pedido.css'
})
export class ModalDetallesPedidoComponent implements OnInit {

  @Input() pedido: Pedido | null = null;
  @Input() modoEdicion: boolean = false; // <-- NUEVO INPUT: Controla si se muestran los controles de edición
  @Output() estadoActualizado = new EventEmitter<void>(); // Notifica cambios

  // Lista de posibles estados para los botones
  posiblesEstados: string[] = ['pendiente', 'aceptado', 'en_preparacion', 'entregado', 'cancelado'];
  // Guarda el estado actual mostrado/seleccionado
  estadoSeleccionado: string = '';

  // Variables para feedback visual durante la actualización
  isUpdatingEstadoPedido = false;
  errorUpdateEstado: string | null = null;

  // Inyección de servicios
  public bsModalRef = inject(BsModalRef); // Para cerrar el modal actual
  private modalService = inject(BsModalService); // Para abrir el modal de pagos
  private pedidoService = inject(PedidoService); // Para actualizar el estado del pedido
  private modalSubscription: Subscription | undefined; // Para desuscribirse al cerrar

  ngOnInit(): void {
    // Inicializa el estado seleccionado al estado actual del pedido
    if (this.pedido) {
      this.estadoSeleccionado = this.pedido.estado || 'pendiente';
    }
  }

  ngOnDestroy(): void {
      this.modalSubscription?.unsubscribe();
  }

  // --- GESTIÓN DE ESTADO DEL PEDIDO ---

  // Solo se llama en modo edición
  cambiarEstadoPedido(nuevoEstado: string): void {
    if (!this.pedido || this.isUpdatingEstadoPedido) return;

    this.isUpdatingEstadoPedido = true;
    this.errorUpdateEstado = null;

    this.pedidoService.actualizarEstadoPedido(this.pedido.pedidoId!, nuevoEstado as EstadoPedidoType).subscribe({
      next: (pedidoActualizado) => {
        this.pedido = pedidoActualizado; // Actualiza el pedido en el modal
        this.estadoSeleccionado = pedidoActualizado.estado; // Actualiza el estado seleccionado
        this.isUpdatingEstadoPedido = false;
        this.estadoActualizado.emit(); // Notifica a GestiónPedidos para recargar
        // NOTA: No cerramos el modal, solo actualizamos el estado.
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
        this.errorUpdateEstado = `Error al actualizar a ${nuevoEstado}: ${err.error?.message || 'Error de conexión.'}`;
        this.isUpdatingEstadoPedido = false;
      }
    });
  }
  
  // --- GESTIÓN DE PAGOS ---

  // Abre el modal de gestión de pagos
  abrirModalGestionPago(): void {
    if (!this.pedido || !this.pedido.pedidoId) return;
    
    // Guardamos la referencia para poder reabrir si es necesario
    const pedidoParaReabrir = this.pedido;

    // 1. Cerrar este modal de detalles
    this.cerrarModal();

    // 2. Abrir el modal de gestión de pagos
    const initialState = {
      pedidoId: this.pedido.pedidoId,
      pagos: this.pedido.pagos || [],
      montoTotal: this.pedido.total || 0,
      montoGarantia: this.pedido.montoGarantia || 0 // Pasa el monto de garantía si existe
    };

    const modalRef: BsModalRef<ModalGestionPago> = this.modalService.show(ModalGestionPago, { initialState, class: 'modal-lg' });

    // 3. Suscribirse a la actualización del pago (y volver a abrir este modal)
    // Cuando se actualiza un pago, recargamos la tabla de pedidos principal
     modalRef.content?.pagoActualizado.subscribe((pagoActualizado) => {
         console.log('Modal de Pago notificó actualización:', pagoActualizado);
         this.estadoActualizado.emit(); // Notifica a GestiónPedidos para recargar
      });
      if (modalRef.content?.volverADetalles) {
          this.modalSubscription = modalRef.content.volverADetalles.subscribe(() => {
              console.log('Reabriendo modal de detalles para pedido:', pedidoParaReabrir.pedidoId);
              // Reabre este mismo modal (DetallesPedido) con los datos guardados
              // Nota: Deberíamos recargar el pedido completo si es posible, pero por ahora reabrimos con el modo de edición
              // forzado a true si vino desde gestión.
              const reopenInitialState = { pedido: pedidoParaReabrir, modoEdicion: this.modoEdicion };
              const reopenModalRef = this.modalService.show(ModalDetallesPedidoComponent, {
                  initialState: reopenInitialState,
                  class: 'modal-lg'
              });
              // Vuelve a suscribirse al evento de estado actualizado del modal reabierto
               reopenModalRef.content?.estadoActualizado.subscribe(() => {
                  this.estadoActualizado.emit();
               });
          });
      }

       // Desuscribirse cuando el modal de pagos se cierre por cualquier motivo
       modalRef.onHidden?.subscribe(() => {
            this.modalSubscription?.unsubscribe();
       });
  }
  
  // --- Helpers para Datos del Cliente (Sin Cambios) ---
  
  getNombreCliente(): string {
    return this.pedido?.usuario?.nombre || 'N/A';
  }
  getEmailCliente(): string {
    return this.pedido?.usuario?.email || '-';
  }
  getTelefonoCliente(): string {
    return this.pedido?.usuario?.telefono || '-';
  }

  // --- Helpers para Clases CSS y Estados ---

  getEstadoClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'pendiente': return 'estado-pendiente';
      case 'aceptado':
      case 'confirmado': return 'estado-confirmado';
      case 'en_preparacion': return 'estado-preparacion';
      case 'entregado': return 'estado-entregado';
      case 'cancelado': return 'estado-cancelado';
      default: return '';
    }
  }

  // --- Gestión de Pago Resumida ---

  // Determina el estado general del pago basado en los pagos validados
  getOverallPagoStatusText(): string {
      if (!this.pedido || !this.pedido.pagos || this.pedido.pagos.length === 0) {
          return 'Sin Pagos Registrados';
      }
      const totalValidado = this.pedido.pagos
          .filter(p => p.estado === 'validado')
          .reduce((sum, p) => sum + p.montoAbonado, 0);

      const montoTotal = this.pedido.total || 0;
      
      if (totalValidado >= montoTotal) {
          return 'PAGO COMPLETADO';
      } else if (totalValidado > 0) {
          return `ABONO (S/ ${totalValidado.toFixed(2)})`;
      } else {
          const hayPendientes = this.pedido.pagos.some(p => p.estado === 'pendiente_validacion');
          return hayPendientes ? 'PAGOS PENDIENTES DE VALIDACIÓN' : 'PENDIENTE DE PAGO';
      }
  }

  getOverallPagoStatusClass(): string {
      const statusText = this.getOverallPagoStatusText();
      if (statusText === 'PAGO COMPLETADO') return 'pago-validado';
      if (statusText.includes('ABONO')) return 'pago-parcial';
      if (statusText === 'PAGOS PENDIENTES DE VALIDACIÓN') return 'pago-pendiente';
      return 'pago-no-registrado';
  }


  // --- Cerrar modal ---
  cerrarModal(): void {
    this.bsModalRef.hide();
  }
}