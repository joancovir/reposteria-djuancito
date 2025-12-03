import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contacto } from '../../../modelos/contacto'; 
import { ContactoService } from '../../../servicios/contacto'; 
import { AutenticacionService } from '../../../servicios/autenticacion';

@Component({
  selector: 'app-gestion-consultas',
  standalone: true,
  imports: [
    CommonModule 
  ],
  templateUrl: './gestion-consultas.html',
  styleUrl: './gestion-consultas.css'
})
export class GestionConsultas implements OnInit {

  listaDeConsultas: Contacto[] = [];
  consultaSeleccionada: Contacto | null = null; 
  isLoading = true;
  errorMensaje: string | null = null;
  esAdministrador = false; 

  private contactoService = inject(ContactoService);
  private authService = inject(AutenticacionService);

  ngOnInit(): void {
    // === DEBUG: VERIFICAR ROLES ===
    const user = this.authService.obtenerUsuarioActual();
    if (user) {
        console.log('Usuario actual:', user.nombre);
        console.log('Roles del usuario:', user.roles); // MUESTRA ESTO EN CONSOLA
    } else {
        console.warn('Usuario no autenticado.');
    }
    // =============================

    // 1. Verificar si el usuario es administrador
    // Si la corrección en el servicio funciona, 'esAdministrador' será TRUE para el Admin.
    this.esAdministrador = this.authService.userHasRole('Administrador');
    
    // Si la verificación falla (esAdministrador es false), se muestra el mensaje de error.
    if (this.esAdministrador) {
      this.cargarConsultas();
    } else {
      this.isLoading = false;
      this.errorMensaje = 'Acceso denegado. Se requiere el rol de Administrador para ver todas las consultas.';
    }
  }

  cargarConsultas(): void {
    this.isLoading = true;
    this.errorMensaje = null;
    this.contactoService.obtenerTodasLasConsultas().subscribe({
      next: (data) => {
        this.listaDeConsultas = data;
        this.isLoading = false;
        console.log('Consultas cargadas correctamente.'); // ÉXITO
      },
      error: (err) => {
        console.error('Error al cargar todas las consultas (inesperado):', err);
        if (err.status === 403) {
             this.errorMensaje = 'No tienes permiso para ver esta sección. Asegúrate de haber iniciado sesión como Administrador.';
        } else {
             this.errorMensaje = 'No se pudieron cargar las consultas. Intenta más tarde.';
        }
        this.isLoading = false;
      }
    });
  }

  // --- Funciones para futuros Modales/Acciones ---
  verConsulta(consulta: Contacto): void {
    this.consultaSeleccionada = consulta;
    console.log('Ver detalles de consulta:', consulta.contactoId);
    // Lógica para modal de visualización
  }

  editarConsulta(consulta: Contacto): void {
    this.consultaSeleccionada = consulta;
    console.log('Editar consulta:', consulta.contactoId);
    // Lógica para modal de edición (ej: cambiar estado)
  }

  // --- Función para mapear estado a clase CSS ---
  getEstadoClass(estado: string | undefined): string {
    switch (estado?.toLowerCase()) {
      case 'pendiente': return 'estado-pendiente';
      case 'respondido':
      case 'resuelto': // Añadido basado en prototipo
      case 'en proceso': return 'estado-proceso'; // Añadido basado en prototipo
      default: return '';
    }
  }

  // --- Función para Prioridad (datos de ejemplo basados en prototipo) ---
  getPrioridadClass(consultaId: number): string {
    // Lógica temporal, necesitaría datos reales del backend
    if (consultaId % 2 === 0) return 'prioridad-alta';
    return 'prioridad-media';
  }
  getPrioridadTexto(consultaId: number): string {
      if (consultaId % 2 === 0) return 'Alta';
      return 'Media';
   }
}