import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../modelos/producto';
import { CarritoService } from '../../servicios/carrito';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mi-pedido',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mi-pedido.html',
  styleUrl: './mi-pedido.css'
})
export class MiPedido implements OnInit {

  itemsDelCarrito$: Observable<Producto[]>;
  total: number = 0;

  constructor(private carritoService: CarritoService) {
    this.itemsDelCarrito$ = this.carritoService.items$;
  }

  ngOnInit(): void {
    // Nos suscribimos a los cambios para recalcular el total
    this.itemsDelCarrito$.subscribe(items => {
      this.total = items.reduce((sum, item) => sum + item.precioBase, 0);
    });
  }
}
