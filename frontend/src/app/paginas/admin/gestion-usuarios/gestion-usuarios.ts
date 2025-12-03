
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Usuario } from '../../../modelos/usuario'; 
import { UsuarioService } from '../../../servicios/usuario';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [
    CommonModule 
  ],
  templateUrl: './gestion-usuarios.html',
  styleUrl: './gestion-usuarios.css'
})
export class GestionUsuarios implements OnInit {

  listaDeUsuarios: Usuario[] = [];
  usuarioSeleccionado: Usuario | null = null; 
  isLoading = true;
  errorMensaje: string | null = null;

  private usuarioService = inject(UsuarioService);

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.isLoading = true;
    this.errorMensaje = null;
    this.usuarioService.obtenerTodosLosUsuarios().subscribe({
      next: (data) => {
        this.listaDeUsuarios = data.map(user => {
          const { password, ...userWithoutPassword } = user; 
          return userWithoutPassword as Usuario; 
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar todos los usuarios:', err);
        if (err.status === 403) {
            this.errorMensaje = 'No tienes permiso para ver esta sección. Asegúrate de haber iniciado sesión como Administrador.';
        } else {
            this.errorMensaje = 'No se pudieron cargar los usuarios. Intenta más tarde.';
        }
        this.isLoading = false;
      }
    });
  }

  // --- Funciones para futuros Modales/Acciones ---
  verUsuario(usuario: Usuario): void {
    this.usuarioSeleccionado = usuario;
    console.log('Ver detalles de usuario:', usuario.usuarioId);
  }

  editarUsuario(usuario: Usuario): void {
    this.usuarioSeleccionado = usuario;
    console.log('Editar usuario:', usuario.usuarioId);
  }

  getEstadoClass(estado: string | undefined): string {
    switch (estado?.toLowerCase()) {
      case 'activo': return 'estado-activo';
      case 'inactivo': return 'estado-inactivo';
      default: return '';
    }
  } 
}