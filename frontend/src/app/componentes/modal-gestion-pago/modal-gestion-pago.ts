import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Pago } from '../../modelos/pago';
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

  @Output() pagoActualizado = new EventEmitter<Pago>();
  @Output() volverADetalles = new EventEmitter<void>();

  isUpdatingPago: number | null = null;
  errorMensaje: string | null = null;

  totalPagadoValidado: number = 0;

  public bsModalRef = inject(BsModalRef);
  private pagoService = inject(PagoService);

  ngOnInit(): void {
    this.calcularTotalPagadoValidado();
  }

  cambiarEstadoPago(pago: Pago, accion: 'validar' | 'rechazar'): void {
    if (!pago?.pagoId || this.isUpdatingPago) return;

    const estadoEnviar: 'validado' | 'rechazado' = accion === 'validar' ? 'validado' : 'rechazado';

    this.isUpdatingPago = pago.pagoId;
    this.errorMensaje = null;

    this.pagoService.actualizarEstadoPago(pago.pagoId, estadoEnviar).subscribe({
      next: (pagoActualizado) => {
        const index = this.pagos.findIndex(p => p.pagoId === pago.pagoId);
        if (index !== -1) this.pagos[index] = pagoActualizado;
        this.calcularTotalPagadoValidado();
        this.pagoActualizado.emit(pagoActualizado);
        this.isUpdatingPago = null;
      },
      error: (err) => {
        this.errorMensaje = `Error al ${accion} el pago`;
        this.isUpdatingPago = null;
        console.error(err);
      }
    });
  }

  calcularTotalPagadoValidado(): void {
    this.totalPagadoValidado = this.pagos
      .filter(p => p.estado === 'validado')
      .reduce((acc, p) => acc + p.montoAbonado, 0);
  }

  get saldoPendiente(): number {
    return Math.max(0, this.montoTotal - this.totalPagadoValidado);
  }

  volver(): void {
    this.volverADetalles.emit();
    this.cerrarModal();
  }

  cerrarModal(): void {
    this.bsModalRef.hide();
  }

  getPagoStatusClass(estado: string): string {
    switch (estado) {
      case 'pendiente_validacion': return 'pago-pendiente';
      case 'validado': return 'pago-validado';
      case 'rechazado': return 'pago-rechazado';
      default: return '';
    }
  }

  getPagoItemClass(estado: string): string {
    switch (estado) {
      case 'pendiente_validacion': return 'item-pendiente';
      case 'validado': return 'item-validado';
      case 'rechazado': return 'item-rechazado';
      default: return '';
    }
  }

  formatEstadoPago(estado: string): string {
    if (!estado) return '';
    return estado.replace(/_/g, ' ').toUpperCase();
  }
}
