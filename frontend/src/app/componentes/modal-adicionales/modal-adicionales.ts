import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Adicional } from '../../modelos/adicional';
import { FormsModule } from '@angular/forms'; 
import { CarritoService, Personalizacion } from '../../servicios/carrito'; // ⬅️ Nuevo Import

@Component({
  selector: 'app-modal-adicionales',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ FormsModule es crucial
  templateUrl: './modal-adicionales.html', 
  styleUrl: './modal-adicionales.css'
})
export class ModalAdicionalesComponent implements OnInit {
  @Input() adicionales: Adicional[] = [];
  @Input() productoId!: number; // Esta propiedad debe ser asignada por el componente padre
  seleccionados: Adicional[] = [];
  instruccionesEspeciales: string = '';

  constructor(
    public bsModalRef: BsModalRef,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    // FIX de Seguridad: Si el ID no se pasó, no se puede inicializar
    if (!this.productoId) {
      console.warn("Advertencia: productoId no se ha asignado al modal. No se inicializará el estado.");
      return;
    }
    
    // Inicializar el estado si el ítem ya tenía personalización previa
    const item = this.carritoService.obtenerItems().find(i => i.productoId === this.productoId);

    if (item?.personalizacion) {
      this.instruccionesEspeciales = item.personalizacion.descripcionExtra || '';
      
      // CORRECCIÓN 1: Usar .adicionalId
      this.seleccionados = this.adicionales.filter(ad => 
        item.personalizacion!.adicionalesSeleccionados.includes(ad.adicionalId)
      );
    }
  }

  // Función para manejar el cambio en los checkboxes
  manejarSeleccion(adicional: Adicional, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.checked) {
      this.seleccionados.push(adicional);
    } else {
      // CORRECCIÓN 2: Usar .adicionalId
      this.seleccionados = this.seleccionados.filter(ad => ad.adicionalId !== adicional.adicionalId);
    }
  }

  agregarAlCarrito(): void {
    // FIX PRINCIPAL (Defensa): Evitar llamar al servicio con un ID no definido
    if (!this.productoId) {
      console.error("ERROR CRÍTICO: productoId es undefined. La personalización no se puede guardar.");
      this.bsModalRef.hide();
      return;
    }

    // 1. Calcular el costo total
    const costoAdicionalTotal = this.seleccionados.reduce(
      (acc, ad) => acc + (ad.costoAdicional || 0), 0
    );

    // 2. Crear el objeto de personalización
    const personalizacion: Personalizacion = {
      descripcionExtra: this.instruccionesEspeciales,
      costoAdicional: costoAdicionalTotal,
      // CORRECCIÓN 3: Usar .adicionalId
      adicionalesSeleccionados: this.seleccionados.map(ad => ad.adicionalId) 
    };

    // 3. Llamar al CarritoService para actualizar y recalcular
    this.carritoService.actualizarPersonalizacion(this.productoId, personalizacion);

    this.bsModalRef.hide();
  }
}