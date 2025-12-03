// src/app/paginas/admin/gestion-garantias/gestion-garantias.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GarantiaService, OpcionGarantia } from '../../../servicios/garantia';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-gestion-garantias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './gestion-garantias.html',
  styleUrls: ['./gestion-garantias.css']
})
export class GestionGarantias implements OnInit {

  // INYECCIÓN CORRECTA CON inject() (Angular 14+)
  private garantiaService = inject(GarantiaService);

  opciones: OpcionGarantia[] = [];
  garantiaPrincipal: OpcionGarantia | null = null;
  modalVisible = false;
  esEdicion = false;
  form: OpcionGarantia = { 
    id: 0, 
    porcentaje: 50, 
    descripcion: '', 
    activo: true 
  };

  ngOnInit(): void {
    this.cargarTodo();
  }

  cargarTodo(): void {
    this.garantiaService.obtenerTodas().subscribe({
      next: (opciones: OpcionGarantia[]) => {
        this.opciones = opciones;
        this.garantiaPrincipal = opciones.find(o => o.esPrincipal) 
          || opciones.find(o => o.activo) 
          || opciones[0] 
          || null;
      },
      error: () => alert('Error al cargar garantías')
    });
  }

  establecerPrincipal(opcion: OpcionGarantia): void {
    if (this.garantiaPrincipal?.id === opcion.id) return;

    this.garantiaService.establecerPrincipal(opcion.id).subscribe({
      next: () => {
        alert(`¡Garantía actualizada! Ahora el cliente paga ${opcion.porcentaje}%`);
        this.cargarTodo();
      },
      error: () => alert('Error al establecer garantía principal')
    });
  }

  abrirModal(opcion?: OpcionGarantia): void {
    if (opcion) {
      this.esEdicion = true;
      this.form = { ...opcion };
    } else {
      this.esEdicion = false;
      this.form = { id: 0, porcentaje: 50, descripcion: '', activo: true };
    }
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
  }

  guardar(): void {
    if (this.form.porcentaje < 1 || this.form.porcentaje > 100) {
      alert('El porcentaje debe estar entre 1 y 100');
      return;
    }

    const accion = this.esEdicion
      ? this.garantiaService.actualizar(this.form.id, this.form)
      : this.garantiaService.crear(this.form);

    accion.subscribe({
      next: () => {
        this.cargarTodo();
        this.cerrarModal();
      }
    });
  }

  toggleActivo(opcion: OpcionGarantia): void {
    this.garantiaService.toggleActivo(opcion.id).subscribe({
      next: () => opcion.activo = !opcion.activo
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Seguro que quieres eliminar esta opción?')) return;
    
    this.garantiaService.eliminar(id).subscribe({
      next: () => this.cargarTodo()
    });
  }
}