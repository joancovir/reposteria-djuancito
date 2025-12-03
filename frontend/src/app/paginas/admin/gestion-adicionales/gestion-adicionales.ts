import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Adicional } from '../../../modelos/adicional';
import { AdicionalService } from '../../../servicios/adicional';

@Component({
  selector: 'app-gestion-adicionales',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestion-adicionales.html',
  styleUrls: ['./gestion-adicionales.css']
})
export class GestionAdicionales implements OnInit {

  listaDeAdicionales: Adicional[] = [];
  isLoading = true;
  errorMensaje: string | null = null;

  // Modal
  modalVisible = false;
  esEdicion = false;
  adicionalIdActual: number | null = null;

  form: FormGroup;

  categorias = [
    { valor: 'bizcocho', texto: 'Bizcocho' },
    { valor: 'relleno', texto: 'Relleno' },
    { valor: 'topping', texto: 'Topping' },
    { valor: 'decorado', texto: 'Decorado' },
    { valor: 'extra', texto: 'Extra' },
    { valor: 'mensaje', texto: 'Mensaje' }
  ];

  constructor(
    private fb: FormBuilder,
    private adicionalService: AdicionalService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      categoria: ['', Validators.required],
      costoAdicional: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.cargarAdicionales();
  }

  cargarAdicionales(): void {
    this.isLoading = true;
    this.adicionalService.getAdicionales().subscribe({
      next: (data) => {
        this.listaDeAdicionales = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMensaje = 'Error al cargar adicionales';
        this.isLoading = false;
      }
    });
  }

  // === ABRIR MODAL CREAR ===
  abrirCrear() {
    this.esEdicion = false;
    this.adicionalIdActual = null;
    this.form.reset({
      nombre: '',
      categoria: '',
      costoAdicional: 0
    });
    this.modalVisible = true;
  }

  // === ABRIR MODAL EDITAR ===
  abrirEditar(adicional: Adicional) {
    this.esEdicion = true;
    this.adicionalIdActual = adicional.adicionalId;
    this.form.patchValue({
      nombre: adicional.nombre,
      categoria: adicional.categoria,
      costoAdicional: adicional.costoAdicional
    });
    this.modalVisible = true;
  }

  // === GUARDAR (CREAR O EDITAR) ===
  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const datos = this.form.value;

    if (this.esEdicion && this.adicionalIdActual) {
      // EDITAR
      this.adicionalService.actualizar(this.adicionalIdActual, datos).subscribe({
        next: () => {
          alert('Adicional actualizado correctamente');
          this.cerrarModal();
          this.cargarAdicionales();
        },
        error: () => alert('Error al actualizar')
      });
    } else {
      // CREAR
      this.adicionalService.crear(datos).subscribe({
        next: () => {
          alert('Adicional creado correctamente');
          this.cerrarModal();
          this.cargarAdicionales();
        },
        error: () => alert('Error al crear adicional')
      });
    }
  }

  // === ELIMINAR ===
  eliminarAdicional(adicional: Adicional) {
    if (!confirm(`¿Seguro que quieres eliminar "${adicional.nombre}"?`)) return;

    this.adicionalService.eliminar(adicional.adicionalId!).subscribe({
      next: () => {
        alert('Adicional eliminado');
        this.cargarAdicionales();
      },
      error: () => alert('Error al eliminar')
    });
  }

  cerrarModal() {
    this.modalVisible = false;
  }
}