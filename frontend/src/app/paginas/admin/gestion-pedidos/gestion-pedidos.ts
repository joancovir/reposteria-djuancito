import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pedido } from '../../../modelos/pedido';
import { PedidoService } from '../../../servicios/pedido';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'; // Import modal service
import { ModalDetallesPedidoComponent } from '../../../componentes/modal-detalles-pedido/modal-detalles-pedido'; // Import the modal component


@Component({
  selector: 'app-gestion-pedidos',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './gestion-pedidos.html',
  styleUrl: './gestion-pedidos.css'
})
export class GestionPedidos implements OnInit {

  listaDePedidos: Pedido[] = [];
  // pedidoSeleccionado: Pedido | null = null; // No longer needed here
  bsModalRef?: BsModalRef; // To hold the reference to the opened modal
  isLoading = true;
  errorMensaje: string | null = null;

  private pedidoService = inject(PedidoService);
  private modalService = inject(BsModalService); // <-- Inyecta el servicio de modal

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    // ... (logic to load pedidos remains the same) ...
    this.isLoading = true;
    this.errorMensaje = null;

    this.pedidoService.obtenerTodosLosPedidos().subscribe({
      next: (pedidos) => {
        // Ordena por ID descendente
        this.listaDePedidos = pedidos.sort((a, b) => (b.pedidoId || 0) - (a.pedidoId || 0)); 
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar pedidos:', error);
        this.errorMensaje = 'No se pudieron cargar los pedidos.';
        this.isLoading = false;
      }
    });
  }

  // --- 1. Botón OJO (SOLO LECTURA) ---
  abrirModalDetalles(pedido: Pedido): void {
    // Usamos el mismo modal, pero le indicamos que es SOLO LECTURA
    const initialState = {
      pedido: pedido,
      modoEdicion: false // Nuevo parámetro para controlar la UI
    };
    this.bsModalRef = this.modalService.show(ModalDetallesPedidoComponent, { initialState, class: 'modal-lg' });
    
    // Si se actualiza algo internamente (p.ej., el pago) queremos recargar la tabla
    this.bsModalRef.content.estadoActualizado.subscribe(() => {
        console.log('Modal notificó actualización, recargando pedidos...');
        this.cargarPedidos(); 
    });
  }
  
  // --- 2. Botón LÁPIZ (GESTIONAR ESTADO/PAGO) ---
  abrirModalGestion(pedido: Pedido): void {
    // Usamos el mismo modal, pero le indicamos que es MODO EDICIÓN
    const initialState = {
      pedido: pedido,
      modoEdicion: true // Nuevo parámetro para controlar la UI
    };
    this.bsModalRef = this.modalService.show(ModalDetallesPedidoComponent, { initialState, class: 'modal-lg' });

    // Si se actualiza algo internamente (p.ej., el pago) queremos recargar la tabla
    this.bsModalRef.content.estadoActualizado.subscribe(() => {
        console.log('Modal notificó actualización, recargando pedidos...');
        this.cargarPedidos(); 
    });
  }
  
  // --- Helpers para la Tabla Principal (Sin Cambios) ---

   getNombreCliente(pedido: Pedido): string {
    if (pedido.usuario && pedido.usuario.nombre) {
      return pedido.usuario.nombre; 
    }
    else if (pedido.usuario && pedido.usuario.usuarioId) {
      return `Usuario ID: ${pedido.usuario.usuarioId}`;
    }
    else {
      return 'Cliente Desconocido';
    }
  }
   getEmailCliente(pedido: Pedido): string {
       return pedido.usuario?.email || '-';
   }
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
   getPagoClass(pagoStatus: string): string {
      switch (pagoStatus?.toLowerCase()) {
         case 'pagado': return 'pago-pagado';
         case 'pendiente': return 'pago-pendiente';
         default: return '';
      }
   }
}