import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ResenaService, EstadoResena } from '../../../servicios/resena';

interface ResenaAdmin {
  resenaId: number;
  nombreUsuario: string;
  pedidoId?: number;
  fechaPedido?: string;
  valoracion: number;
  comentario: string;
  fotoUrl?: string;
  fecha: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
}

@Component({
  selector: 'app-gestion-resenas',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './gestion-resenas.html',
  styleUrls: ['./gestion-resenas.css']
})
export class GestionResenas implements OnInit {

  resenas: ResenaAdmin[] = [];
  isLoading = true;
  errorMensaje: string | null = null;
  loadingId: number | null = null;

  // Modal foto
  modalFotoUrl: string | null = null;
  modalComentario: string | null = null;

  private resenaService = inject(ResenaService);

  ngOnInit(): void {
    this.cargarResenas();
  }

  cargarResenas(): void {
    this.isLoading = true;
    this.resenaService.obtenerTodasLasResenasAdmin().subscribe({
      next: (data: any[]) => {
        this.resenas = data.map(r => ({
          resenaId: r.resenaId,
          nombreUsuario: r.nombreUsuario || 'Anónimo',
          pedidoId: r.pedidoId || null,
          fechaPedido: r.fechaPedido,
          valoracion: r.valoracion,
          comentario: r.comentario,
          fotoUrl: r.fotoUrl,
          fecha: r.fecha,
          estado: r.estado || 'pendiente'
        }));
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMensaje = err.status === 403 
          ? 'No tienes permisos de administrador.' 
          : 'Error al cargar las reseñas.';
        this.isLoading = false;
      }
    });
  }

  cambiarEstado(resenaId: number, estado: EstadoResena): void {
    if (this.loadingId) return;
    this.loadingId = resenaId;

    this.resenaService.actualizarEstadoResena(resenaId, estado).subscribe({
      next: () => {
        const resena = this.resenas.find(r => r.resenaId === resenaId);
        if (resena) resena.estado = estado;
        this.loadingId = null;
      },
      error: () => {
        alert('Error al actualizar el estado');
        this.loadingId = null;
      }
    });
  }

  abrirModalFoto(url: string, comentario: string): void {
    this.modalFotoUrl = url;
    this.modalComentario = comentario;
    document.body.classList.add('modal-open');
  }

  cerrarModalFoto(): void {
    this.modalFotoUrl = null;
    this.modalComentario = null;
    document.body.classList.remove('modal-open');
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'aprobado': return 'bg-success';
      case 'rechazado': return 'bg-danger';
      case 'pendiente': return 'bg-warning text-dark';
      default: return 'bg-secondary';
    }
  }
}