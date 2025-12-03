
import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Pago, EstadoPago } from '../../modelos/pago'; 
import { PagoService } from '../../servicios/pago'; 

@Component({
  selector: 'app-modal-gestion-pago',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-gestion-pago.html',
  styleUrls: ['./modal-gestion-pago.css'] 
})
export class ModalGestionPago implements OnInit {

  @Input() pedidoId: number | null = null;
  @Input() pagos: Pago[] = []; 
  @Input() montoTotal: number = 0;
  @Input() montoGarantia: number = 0;

  // --- Output para notificar cambios ---
  @Output() pagoActualizado = new EventEmitter<Pago>(); 
  @Output() volverADetalles = new EventEmitter<void>();
  // --- Estado interno ---
  isUpdatingPago: number | null = null;
  errorMensaje: string | null = null;
  totalPagadoValidado: number = 0; 

  // --- Inyección de servicios ---
  public bsModalRef = inject(BsModalRef);
  private pagoService = inject(PagoService);

  constructor() {}

  ngOnInit(): void {
    console.log('Modal Gestión Pagos iniciado con:', this.pagos);
    this.calcularTotalPagadoValidado(); 
  }

  cambiarEstadoPago(pago: Pago, nuevoEstado: EstadoPago): void {
    if (!pago || this.isUpdatingPago) return;

    this.isUpdatingPago = pago.pagoId;
    this.errorMensaje = null;

    this.pagoService.actualizarEstadoPago(pago.pagoId, nuevoEstado).subscribe({
      next: (pagoActualizado) => {
        const index = this.pagos.findIndex(p => p.pagoId === pago.pagoId);
        if (index > -1) {
          this.pagos[index] = pagoActualizado;
        }
        this.isUpdatingPago = null;
        this.calcularTotalPagadoValidado(); 
        this.pagoActualizado.emit(pagoActualizado); 
      },
      error: (err) => {
        console.error(`Error al ${nuevoEstado} el pago ${pago.pagoId}:`, err);
        this.errorMensaje = `Error al ${nuevoEstado} el pago: ${err.error || 'Error desconocido'}`;
        this.isUpdatingPago = null;
      }
    });
  }

  // --- Calcular total pagado (solo validados) ---
  calcularTotalPagadoValidado(): void {
    this.totalPagadoValidado = this.pagos
      .filter(p => p.estado === 'validado')
      .reduce((sum, p) => sum + p.montoAbonado, 0);
  }

  // --- Saldo Pendiente ---
  get saldoPendiente(): number {
      return Math.max(0, this.montoTotal - this.totalPagadoValidado);
  }
  
  volver(): void {
      this.volverADetalles.emit(); 
      this.cerrarModal(); 
  }
  // --- Cerrar modal ---
  cerrarModal(): void {
    this.bsModalRef.hide();
  }

  // --- Helpers para clases CSS y formato (igual que antes) ---
  getPagoStatusClass(estado: EstadoPago): string {
    switch (estado) {
      case 'pendiente_validacion': return 'pago-pendiente';
      case 'validado': return 'pago-validado';
      case 'rechazado': return 'pago-rechazado';
      default: return '';
    }
  }
  getPagoItemClass(estado: EstadoPago): string {
     switch (estado) {
      case 'pendiente_validacion': return 'item-pendiente';
      case 'validado': return 'item-validado';
      case 'rechazado': return 'item-rechazado';
      default: return '';
    }
  }
  formatEstadoPago(estado: EstadoPago): string {
    if (!estado) return '';
    return estado.replace('_', ' ');
  }
}