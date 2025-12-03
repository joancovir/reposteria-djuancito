
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resena } from '../../../modelos/resena'; // Importa modelo
import { ResenaService, EstadoResena } from '../../../servicios/resena'; // Importa servicio y tipo

@Component({
  selector: 'app-gestion-resenas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-resenas.html',
  styleUrls: ['./gestion-resenas.css']
})
export class GestionResenas implements OnInit {

  listaDeResenas: Resena[] = [];
  isLoading = true;
  errorMensaje: string | null = null;
  updatingStatus: { [key: number]: boolean } = {}; // Para feedback de carga por reseña

  private resenaService = inject(ResenaService);

  ngOnInit(): void {
    this.cargarResenas();
  }

  cargarResenas(): void {
    this.isLoading = true;
    this.errorMensaje = null;
    this.resenaService.obtenerTodasLasResenasAdmin().subscribe({
      next: (data) => {
        this.listaDeResenas = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar reseñas:', err);
         if (err.status === 403) { this.errorMensaje = 'No tienes permiso.'; }
         else { this.errorMensaje = 'No se pudieron cargar las reseñas.'; }
        this.isLoading = false;
      }
    });
  }

  cambiarEstado(resena: Resena, nuevoEstado: EstadoResena): void {
     if (this.updatingStatus[resena.resenaId]) return; // Evita doble click

     this.updatingStatus[resena.resenaId] = true; // Marca como actualizando
     this.errorMensaje = null; // Limpia error general

     this.resenaService.actualizarEstadoResena(resena.resenaId, nuevoEstado).subscribe({
         next: (resenaActualizada) => {
             // Actualiza la reseña en la lista local
             const index = this.listaDeResenas.findIndex(r => r.resenaId === resena.resenaId);
             if (index > -1) {
                 this.listaDeResenas[index] = resenaActualizada;
             }
              delete this.updatingStatus[resena.resenaId]; // Quita marca
         },
         error: (err) => {
             console.error(`Error al cambiar estado a ${nuevoEstado}:`, err);
             alert(`Error al actualizar: ${err.error || 'Desconocido'}`);
              delete this.updatingStatus[resena.resenaId]; // Quita marca
         }
     });
  }

  // --- Helpers ---
  getEstadoClass(estado: string | undefined): string {
    switch (estado?.toLowerCase()) {
      case 'pendiente': return 'estado-pendiente';
      case 'aprobado': return 'estado-aprobado';
      case 'rechazado': return 'estado-rechazado';
      default: return '';
    }
  }

   getNombreCliente(resena: Resena): string {
     return resena.usuario?.nombre || 'Anónimo';
   }
    getPedidoId(resena: Resena): string {
      return resena.pedido?.pedidoId ? `ORD-${resena.pedido.pedidoId}` : '-';
    }
}