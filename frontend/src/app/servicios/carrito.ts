// src/app/servicios/carrito.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../modelos/producto';

export interface ItemCarrito {
  productoId: number;
  nombre: string;
  imagenUrl: string;
  precioBase: number;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
  promocionId?: number | null;
  nombrePromocion?: string | null;
  descuentoAplicado?: number;
  esOfertaEspecial?: boolean;
  personalizable?: boolean;
  personalizacion?: any;
}

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private items = new BehaviorSubject<ItemCarrito[]>([]);
  items$ = this.items.asObservable();

  constructor() {
    this.cargar();
  }

  agregarAlCarrito(producto: Producto | ItemCarrito) {
    if ('precioUnitario' in producto === false) {
      const p = producto as Producto;
      const item: ItemCarrito = {
        productoId: p.productoId,
        nombre: p.nombre,
        imagenUrl: p.imagenUrl,
        precioBase: p.precioBase,
        precioUnitario: p.precioBase,
        cantidad: 1,
        subtotal: p.precioBase,
        personalizable: p.personalizable,
        personalizacion: p.personalizacion
      };
      this.agregarItem(item);
    } else {
      this.agregarItem(producto as ItemCarrito);
    }
  }

  private agregarItem(item: ItemCarrito) {
    const actuales = this.items.getValue();
    const existe = actuales.find(i => i.productoId === item.productoId);

    if (existe) {
      existe.cantidad += item.cantidad;
      existe.subtotal = existe.precioUnitario * existe.cantidad;
    } else {
      item.subtotal = item.precioUnitario * item.cantidad;
      actuales.push(item);
    }

    this.items.next(actuales);
    this.guardar();
  }

  cambiarCantidad(productoId: number, cantidad: number) {
    if (cantidad < 1) return;
    const items = this.items.getValue();
    const item = items.find(i => i.productoId === productoId);
    if (item) {
      item.cantidad = cantidad;
      item.subtotal = item.precioUnitario * cantidad;
      this.items.next(items);
      this.guardar();
    }
  }

  eliminar(productoId: number) {
    const filtrados = this.items.getValue().filter(i => i.productoId !== productoId);
    this.items.next(filtrados);
    this.guardar();
  }

  obtenerItems(): ItemCarrito[] {
    return this.items.getValue();
  }

  calcularTotal(): number {
    return this.items.getValue().reduce((t, i) => t + i.subtotal, 0);
  }

  calcularAhorroTotal(): number {
    return this.items.getValue().reduce((t, i) => t + (i.precioBase - i.precioUnitario) * i.cantidad, 0);
  }

  vaciar() {
    this.items.next([]);
    localStorage.removeItem('carrito_djuancito');
  }

  limpiar() {
    this.vaciar();
  }

  private guardar() {
    localStorage.setItem('carrito_djuancito', JSON.stringify(this.items.getValue()));
  }

  private cargar() {
    const data = localStorage.getItem('carrito_djuancito');
    if (data) {
      try {
        this.items.next(JSON.parse(data));
      } catch (e) {
        console.error('Error cargando carrito', e);
      }
    }
  }
}