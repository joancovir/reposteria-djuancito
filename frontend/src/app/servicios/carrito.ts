import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../modelos/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private itemsEnCarrito = new BehaviorSubject<Producto[]>([]);
  items$ = this.itemsEnCarrito.asObservable();

  constructor() {
    // Al iniciar el servicio, intenta cargar el carrito desde localStorage
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      this.itemsEnCarrito.next(JSON.parse(carritoGuardado));
    }
  }

  agregarAlCarrito(producto: Producto) {
    const itemsActuales = this.itemsEnCarrito.getValue();
    const nuevosItems = [...itemsActuales, producto];
    this.itemsEnCarrito.next(nuevosItems);
    // Guarda el nuevo estado del carrito en localStorage
    this.guardarCarritoEnStorage(nuevosItems);
    alert(`${producto.nombre} ha sido añadido al carrito!`);
  }

  obtenerItems(): Producto[] {
    return this.itemsEnCarrito.getValue();
  }

  // Método nuevo para limpiar el carrito (lo usaremos después de una compra)
  limpiarCarrito(): void {
    this.itemsEnCarrito.next([]);
    localStorage.removeItem('carrito');
  }

  // Método privado para guardar en localStorage
  private guardarCarritoEnStorage(items: Producto[]): void {
    localStorage.setItem('carrito', JSON.stringify(items));
  }
}