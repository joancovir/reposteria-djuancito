
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Promocion } from '../../../modelos/promocion'; 
import { PromocionService } from '../../../servicios/promocion'; 

@Component({
  selector: 'app-gestion-promociones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-promociones.html',
  styleUrls: ['./gestion-promociones.css']
})
export class GestionPromociones implements OnInit {

  listaDePromociones: Promocion[] = [];
  promocionSeleccionada: Promocion | null = null;
  isLoading = true;
  errorMensaje: string | null = null;

  private promocionService = inject(PromocionService);

  ngOnInit(): void {
    this.cargarPromociones();
  }

  cargarPromociones(): void {
    this.isLoading = true;
    this.errorMensaje = null;
    this.promocionService.obtenerTodasLasPromociones().subscribe({
      next: (data) => {
        this.listaDePromociones = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar promociones:', err);
         if (err.status === 403) {
             this.errorMensaje = 'No tienes permiso para ver esta sección.';
        } else {
             this.errorMensaje = 'No se pudieron cargar las promociones.';
        }
        this.isLoading = false;
      }
    });
  }eliminarPromocion(promo: Promocion): void {
  if (confirm(`¿Estás seguro de que deseas eliminar la promoción "${promo.titulo}" (ID: ${promo.promocionId})?`)) {
    this.promocionService.eliminarPromocion(promo.promocionId!).subscribe({
      next: () => {
        // Refrescar la lista en el cliente para mostrar el cambio
        this.listaDePromociones = this.listaDePromociones.filter(p => p.promocionId !== promo.promocionId);
        // Opcionalmente, mostrar una notificación (usando ngx-toastr que instalaste)
        // this.toastr.success('Promoción eliminada con éxito');
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        this.errorMensaje = 'Error al eliminar la promoción.';
        // this.toastr.error('Error al eliminar la promoción');
      }
    });
  }
}

  // --- Placeholders ---
  crearPromocion(): void { alert('Funcionalidad Crear Promoción pendiente.'); }
  editarPromocion(promo: Promocion): void { alert(`Funcionalidad Editar Promoción ${promo.titulo} pendiente.`); }
  getEstadoClass(estado: string | undefined): string { return estado === 'activo' ? 'estado-activo' : 'estado-inactivo'; }
}