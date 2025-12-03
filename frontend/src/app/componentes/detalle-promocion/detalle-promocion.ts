import { Component, OnInit } from '@angular/core';
import { CommonModule, Location, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Promocion } from '../../modelos/promocion';
import { PromocionService } from '../../servicios/promocion';
import { CarritoService, ItemCarrito } from '../../servicios/carrito';

@Component({
  selector: 'app-detalle-promocion',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [DatePipe],
  templateUrl: './detalle-promocion.html',
  styleUrls: ['./detalle-promocion.css']
})
export class DetallePromocionComponent implements OnInit {

  promocionId: number | null = null;
  promocion: Promocion | null = null;
  cargando = true;
  error: string | null = null;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private promocionService: PromocionService,
    private carritoService: CarritoService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.promocionId = id ? +id : null;
      if (this.promocionId) {
        this.cargarDetallePromocion(this.promocionId);
      } else {
        this.cargando = false;
        this.error = 'Promoción no encontrada';
      }
    });
  }

  volver(): void {
    this.location.back();
  }

  cargarDetallePromocion(id: number): void {
    this.cargando = true;
    this.promocionService.getPromocionById(id).subscribe({
      next: (data) => {
        this.promocion = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar la promoción';
        this.cargando = false;
      }
    });
  }

  // FECHAS EN ESPAÑOL
  formatearFecha(date: string | Date | null | undefined): string {
    if (!date) return 'Fecha no disponible';
    return this.datePipe.transform(date, 'dd MMMM yyyy', undefined, 'es-PE') || 'Fecha inválida';
  }

  // PORCENTAJE PARA MOSTRAR (10, 20, 100, etc.)
  porcentajeDescuento(): number {
    if (!this.promocion?.descuento) return 0;
    const d = this.promocion.descuento;
    return d > 1 ? Math.round(d) : Math.round(d * 100);
  }

  // PRECIO CON DESCUENTO (funciona con 10.00 o 0.10)
  precioConDescuento(precioBase: number): number {
    if (!this.promocion?.descuento || precioBase <= 0) return precioBase;

    const descuentoRaw = this.promocion.descuento;
    const descuento = descuentoRaw > 1 ? descuentoRaw / 100 : descuentoRaw;

    if (descuento <= 0 || descuento >= 1) return precioBase;

    return Math.max(0, precioBase * (1 - descuento));
  }

  // SUBTOTAL ACTUAL DEL CARRITO (para monto mínimo)
  subtotalCarritoActual(): number {
    return this.carritoService.calcularTotal();
  }

  // FUNCIÓN PRINCIPAL: AÑADIR AL CARRITO (100% CORRECTA)
  agregarAlCarrito(producto: any): void {
    if (!producto || !this.promocion) return;

    const descuentoRaw = this.promocion.descuento ?? 0;
    
    // Normalizamos el descuento
    const descuento = descuentoRaw > 1 ? descuentoRaw / 100 : descuentoRaw;
    
    // Es regalo si es 100% (1.00 o 100.00)
    const esRegalo = descuentoRaw >= 100 || descuento >= 1;

    // Precio final (nunca negativo)
    const precioFinal = esRegalo 
      ? 0 
      : Math.max(0, producto.precioBase * (1 - descuento));

    const item: ItemCarrito = {
      productoId: producto.productoId,
      nombre: producto.nombre ?? 'Producto sin nombre',
      imagenUrl: producto.imagenUrl ?? '',
      precioBase: producto.precioBase ?? 0,
      precioUnitario: precioFinal,
      cantidad: 1,
      subtotal: precioFinal,
      promocionId: this.promocion.promocionId ?? null,
      nombrePromocion: this.promocion.titulo ?? null,
      descuentoAplicado: descuento,
      esOfertaEspecial: esRegalo
    };

    this.carritoService.agregarAlCarrito(item);

    // MENSAJES PERFECTOS
    if (esRegalo) {
      alert(`¡${producto.nombre} AÑADIDO COMO REGALO 100% GRATIS!`);
    } else if (descuento > 0 && descuento < 1) {
      alert(`${producto.nombre} añadido con ${this.porcentajeDescuento()}% OFF`);
    } else {
      alert(`${producto.nombre} añadido al carrito`);
    }
  }

  irAProducto(id: number): void {
    this.router.navigate(['/producto', id]);
  }
}