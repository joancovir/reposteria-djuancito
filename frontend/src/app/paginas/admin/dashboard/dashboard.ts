
import { Component, OnInit, inject,LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { DashboardService, AdminDashboardStats } from '../../../servicios/dashboard'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  providers: [{ provide: LOCALE_ID, useValue: 'es-PE' }] 
})
export class Dashboard implements OnInit { 

  stats: AdminDashboardStats | null = null;
  isLoading = true;
  errorMensaje: string | null = null;
  fechaActual = new Date(); 

  private dashboardService = inject(DashboardService);

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.isLoading = true;
    this.errorMensaje = null;
    this.dashboardService.obtenerEstadisticasAdmin().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
        console.log('Estadísticas recibidas:', this.stats);
      },
      error: (err) => {
        console.error('Error al cargar estadísticas:', err);
        if (err.status === 403) {
           this.errorMensaje = 'No tienes permiso para ver el dashboard.';
        } else {
           this.errorMensaje = 'No se pudieron cargar las estadísticas.';
        }
        this.isLoading = false;
      }
    });
  }
  
  getEstadoClass(estado: string): string {
  switch (estado) {
    case 'PENDIENTE PAGO': return 'estado-pendiente';
    case 'EN PREPARACIÓN': return 'estado-preparacion';
    case 'ENTREGADO': return 'estado-entregado';
    default: return '';
  }
}
}