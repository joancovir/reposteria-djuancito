import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../src/environments/environment';


@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-usuarios.html',
  styleUrls: ['./gestion-usuarios.css']
})
export class GestionUsuarios implements OnInit {
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  filtro: string = '';
  mensaje = '';
  tipoAlerta = '';

  // Modal de edición
  usuarioEditando: any = null;
  nuevoEstado: string = '';

  // API BASE SIN LOCALHOST
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  mostrarAlerta(msj: string, tipo: string = 'success') {
    this.mensaje = msj;
    this.tipoAlerta = tipo;
    setTimeout(() => this.mensaje = '', 4000);
  }

  cargarUsuarios() {
    this.http.get<any[]>(`${this.apiUrl}/usuarios/todos`).subscribe({
      next: (data) => {
        this.usuarios = data;
        this.usuariosFiltrados = [...data];
        this.mostrarAlerta('Usuarios cargados correctamente', 'success');
      },
      error: () => this.mostrarAlerta('Error al cargar usuarios', 'danger')
    });
  }

  filtrarUsuarios() {
    const term = this.filtro.toLowerCase().trim();
    this.usuariosFiltrados = term
      ? this.usuarios.filter(u =>
          u.nombre?.toLowerCase().includes(term) ||
          u.email?.toLowerCase().includes(term)
        )
      : [...this.usuarios];
  }

  abrirEditar(usuario: any) {
    this.usuarioEditando = { ...usuario };
    this.nuevoEstado = usuario.estado;
  }

  guardarCambios() {
    if (!this.usuarioEditando) return;

    const body = {
      nombre: this.usuarioEditando.nombre,
      telefono: this.usuarioEditando.telefono || null,
      estado: this.nuevoEstado
    };

    this.http.put(`${this.apiUrl}/usuarios/${this.usuarioEditando.usuarioId}`, body)
      .subscribe({
        next: () => {
          const usuario = this.usuarios.find(u => u.usuarioId === this.usuarioEditando.usuarioId);
          if (usuario) {
            usuario.nombre = this.usuarioEditando.nombre;
            usuario.telefono = this.usuarioEditando.telefono;
            usuario.estado = this.nuevoEstado;
          }
          this.mostrarAlerta('Usuario actualizado correctamente', 'success');
          this.usuarioEditando = null;
          this.filtrarUsuarios(); // más rápido que recargar todo
        },
        error: (err) => {
          console.error(err);
          this.mostrarAlerta('Error al actualizar usuario', 'danger');
        }
      });
  }

  eliminarUsuario(usuario: any) {
    if (usuario.usuarioId === 1) {
      this.mostrarAlerta('No puedes eliminar al administrador', 'danger');
      return;
    }
    if (confirm(`¿Seguro que deseas eliminar a ${usuario.nombre}?`)) {
      this.http.delete(`${this.apiUrl}/usuarios/${usuario.usuarioId}`).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter(u => u.usuarioId !== usuario.usuarioId);
          this.filtrarUsuarios();
          this.mostrarAlerta('Usuario eliminado', 'success');
        },
        error: () => this.mostrarAlerta('Error al eliminar', 'danger')
      });
    }
  }

  verPedidos(usuario: any) {
    this.router.navigate(['/admin/pedidos'], {
      queryParams: { clienteId: usuario.usuarioId, nombre: usuario.nombre }
    });
  }
}
