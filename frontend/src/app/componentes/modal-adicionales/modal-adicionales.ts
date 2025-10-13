import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Adicional } from '../../modelos/adicional';

@Component({
  selector: 'app-modal-adicionales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-adicionales.html',
  styleUrl: './modal-adicionales.css'
})
export class ModalAdicionalesComponent {
  @Input() adicionales: Adicional[] = [];

  constructor(public bsModalRef: BsModalRef) {}

  
  agregarAlCarrito(): void {

    alert('Lógica para agregar al carrito con personalizaciones aún no implementada.');
    this.bsModalRef.hide();
  }
}