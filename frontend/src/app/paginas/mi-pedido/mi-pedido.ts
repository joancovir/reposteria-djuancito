import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';  
import { CarritoService } from '../../servicios/carrito';
import { GarantiaService } from '../../servicios/garantia';
import { AutenticacionService } from '../../servicios/autenticacion';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mi-pedido',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mi-pedido.html',
  styleUrls: ['./mi-pedido.css']
})
export class MiPedido implements OnInit, OnDestroy {
  itemsDelCarrito: any[] = [];  
  subtotal = 0;
  garantia = 0;
  resto = 0;
  porcentajeGarantia = 50;
  opcionesGarantia: number[] = [];
  private carritoSub!: Subscription;

  constructor(
    private carritoService: CarritoService,
    private garantiaService: GarantiaService,
    private autenticacionService: AutenticacionService,
    private http: HttpClient,  
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarOpcionesGarantia();
    this.cargarGarantiaSeleccionada();
    this.suscribirseAlCarrito();
  }

  ngOnDestroy() {
    this.carritoSub?.unsubscribe();
  }

  private suscribirseAlCarrito() {
    this.carritoSub = this.carritoService.items$.subscribe(items => {
      this.itemsDelCarrito = items;
      this.calcularResumen();
    });
  }

  cargarOpcionesGarantia() {
    this.garantiaService.opciones$.subscribe(opcs => this.opcionesGarantia = opcs);
  }

  cargarGarantiaSeleccionada() {
    this.garantiaService.obtener().subscribe(p => {
      this.porcentajeGarantia = p;
      this.calcularResumen();
    });
  }

  calcularResumen() {
    this.subtotal = this.itemsDelCarrito.reduce((acc, item) =>
      acc + (item.precioUnitario * item.cantidad), 0);
    this.subtotal = Math.round(this.subtotal * 100) / 100;

    this.garantia = Math.round(this.subtotal * this.porcentajeGarantia / 100 * 100) / 100;
    this.resto = Math.round((this.subtotal - this.garantia) * 100) / 100;
  }

  eliminarItem(productoId: number) {
    this.carritoService.eliminar(productoId);
  }

  cambiarCantidad(item: any, delta: number) {
    const nueva = item.cantidad + delta;
    if (nueva > 0) this.carritoService.cambiarCantidad(item.productoId, nueva);
  }

 cambiarGarantia(event: any) {
    const seleccionado = Number(event.target.value);
    this.garantiaService.seleccionar(seleccionado);
    this.porcentajeGarantia = seleccionado;
    this.calcularResumen();
  }

  get descuentoTotal(): number {
    const sinDescuento = this.itemsDelCarrito.reduce((acc, item) =>
      acc + (item.precioBase * item.cantidad), 0);
    const conDescuento = this.subtotal;
    return Math.round((sinDescuento - conDescuento) * 100) / 100;
  }

  get subtotalSinDescuento(): number {
    return this.itemsDelCarrito.reduce((acc, item) =>
      acc + (item.precioBase * item.cantidad), 0);
  }

confirmarPedido() {
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    // Reemplazando alert() por un mensaje en consola y navegación según la política de desarrollo
    console.warn('Debes iniciar sesión para confirmar el pedido.');
    this.router.navigate(['/iniciar-sesion']);
    return;
  }

  const usuarioActual = this.autenticacionService.obtenerUsuarioActual();
  if (!usuarioActual || !usuarioActual.usuarioId) {
    console.error('No se pudo obtener el ID del usuario.');
    this.router.navigate(['/iniciar-sesion']);
    return;
  }

 const detalles = this.itemsDelCarrito.map((item: any) => {
  const precio = Number(item.precioUnitario) || 0;
  const cantidad = Number(item.cantidad) || 1;

  // Extraer solo los IDs si la personalización existe
  const adicionalesIds = item.personalizacion && item.personalizacion.adicionalesSeleccionados
    ? item.personalizacion.adicionalesSeleccionados.map((ad: any) => ad.adicionalId)
    : [];

  return {
    productoId: Number(item.productoId),
    cantidad,
    precioUnitario: precio,
    subtotal: Number((precio * cantidad).toFixed(2)),
    promocionId: item.promocionId ?? null,
    personalizacion: item.personalizacion
      ? {
          descripcionExtra: item.personalizacion.descripcionExtra || null,
          costoAdicional: item.personalizacion.costoAdicional != null 
            ? Number(item.personalizacion.costoAdicional)
            : null,
          // CORRECCIÓN: Ahora se envía un array de IDs, no de objetos.
          adicionalesSeleccionados: adicionalesIds
        }
      : null
  };
});


  const request = {
  usuarioId: usuarioActual.usuarioId,
  detalles: detalles,
  subtotal: this.subtotal,           
  garantiaPagada: this.garantia,     
  resto: this.resto,                 
  total: this.subtotal               
};
  console.log('ENVIANDO PEDIDO:', request);

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  this.http.post<any>('http://localhost:8080/api/pedidos', request, { headers })
    .subscribe({
      next: (res) => {
        localStorage.setItem('pedido_confirmado_id', res.pedidoId.toString());
        localStorage.setItem('pago_garantia', JSON.stringify({
          garantia: this.garantia,
          resto: this.resto,
          subtotal: this.subtotal
        }));

        this.carritoService.vaciar();
        this.itemsDelCarrito = [];

        // Reemplazando alert() por un mensaje en consola y navegación según la política de desarrollo
        console.log('¡Pedido confirmado con éxito!');
        this.router.navigate(['/cliente/pago-garantia']);
      },
      error: (err) => {
        console.error('Error al confirmar pedido:', err);
        // Reemplazando alert() por un mensaje en consola y navegación según la política de desarrollo
        const errorMessage = err.error?.message || 'No se pudo guardar el pedido. Revisar la consola para más detalles.';
        console.error('Error de servidor:', errorMessage);
      }
    });
}
}