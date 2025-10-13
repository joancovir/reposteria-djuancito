import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../modelos/producto';
import { ProductoService } from '../../servicios/producto';
import { CarritoService } from '../../servicios/carrito'; // <-- Importa el servicio del carrito
import { BsModalService, BsModalRef, ModalModule, ModalBackdropComponent } from 'ngx-bootstrap/modal'; // <-- Imports para el Modal
import { ModalAdicionalesComponent } from '../../componentes/modal-adicionales/modal-adicionales';
import { Adicional } from '../../modelos/adicional';
import { AdicionalService } from '../../servicios/adicional';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, ModalModule,RouterLink],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class CatalogoComponent implements OnInit {
  listaDeProductos: Producto[] = [];
  listaDeAdicionales: Adicional[] = [];
  listaDeProductosCompleta: Producto[] = []; 
  listaDeProductosFiltrada: Producto[] = []; 
  titulo = 'Catálogo de Productos';
  bsModalRef?: BsModalRef

  constructor(
    private productoService: ProductoService, 
    private carritoService: CarritoService,
    private adicionalService: AdicionalService,
    private modalService: BsModalService 

  ) { }

  ngOnInit(): void {
    this.productoService.getProductos().subscribe(data => this.listaDeProductos = data);
    this.adicionalService.getAdicionales().subscribe(data => this.listaDeAdicionales = data);
    this.productoService.getProductos().subscribe(data => {
      this.listaDeProductosCompleta = data;
      this.listaDeProductosFiltrada = data; 
    });
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregarAlCarrito(producto);
  }

abrirModalAdicionales() {
  const initialState = {
    adicionales: this.listaDeAdicionales
  };
  this.bsModalRef = this.modalService.show(ModalAdicionalesComponent, { initialState });
}
 filtrarProductos(event: any) {
    const categoria = event.target.value;
    if (categoria) {
        this.productoService.getProductosPorCategoria(categoria).subscribe(data => this.listaDeProductos = data);
    } else {
        this.productoService.getProductos().subscribe(data => this.listaDeProductos = data);
    }
}
}