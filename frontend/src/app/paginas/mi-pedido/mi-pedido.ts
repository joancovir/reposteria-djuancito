import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CarritoService } from '../../servicios/carrito';
import { GarantiaService } from '../../servicios/garantia';
import { AutenticacionService } from '../../servicios/autenticacion';
import { Subscription } from 'rxjs';
import { environment } from '../../../src/environments/environment';
interface Adicional {
  adicionalId: number;
  nombre: string;
  categoria: string;
  costoAdicional: number;
}

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

  // Lista completa de adicionales (para mostrar nombres y precios)
  adicionalesDisponibles: Adicional[] = [];
private apiUrl = environment.apiUrl;
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
    this.cargarAdicionales();
  }

  ngOnDestroy() {
    this.carritoSub?.unsubscribe();
  }

  // CARGAR ADICIONALES PARA MOSTRAR NOMBRE Y PRECIO EN CARRITO
  cargarAdicionales() {
    this.http.get<Adicional[]>(`${this.apiUrl}/adicionales`).subscribe({
      next: (data) => this.adicionalesDisponibles = data,
      error: (err) => console.error('Error cargando adicionales:', err)
    });
  }

  obtenerNombreAdicional(adicionalId: number): string {
    const ad = this.adicionalesDisponibles.find(a => a.adicionalId === adicionalId);
    return ad ? `${ad.nombre} (${ad.categoria})` : 'Adicional';
  }

  obtenerCostoAdicional(adicionalId: number): number {
    const ad = this.adicionalesDisponibles.find(a => a.adicionalId === adicionalId);
    return ad ? ad.costoAdicional : 0;
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
    return Math.round((sinDescuento - this.subtotal) * 100) / 100;
  }

  get subtotalSinDescuento(): number {
    return this.itemsDelCarrito.reduce((acc, item) =>
      acc + (item.precioBase * item.cantidad), 0);
  }

 confirmarPedido() {
  const token = localStorage.getItem('jwt_token');

  if (!token) {
    localStorage.setItem('redirect_after_login', '/cliente/mi-pedido');
    alert('¡Debes iniciar sesión para confirmar tu pedido!');
    this.router.navigate(['/iniciar-sesion']);
    return;
  }

  const usuarioActual = this.autenticacionService.obtenerUsuarioActual();
  if (!usuarioActual?.usuarioId) {
    localStorage.setItem('redirect_after_login', '/cliente/mi-pedido');
    this.router.navigate(['/iniciar-sesion']);
    return;
  }

  const detalles = this.itemsDelCarrito.map((item: any) => {
    const adicionalesCompletos = (item.personalizacion?.adicionalesSeleccionados || []).map((id: number) => {
      const adicional = this.adicionalesDisponibles.find(a => a.adicionalId === id);
      return {
        adicionalId: id,
        nombre: adicional?.nombre || 'Adicional',
        categoria: adicional?.categoria || '',
        costoAdicional: adicional?.costoAdicional || 0
      };
    });

    return {
      productoId: Number(item.productoId),
      cantidad: Number(item.cantidad),
      precioUnitario: Number(item.precioUnitario),
      subtotal: Number((item.precioUnitario * item.cantidad).toFixed(2)),
      promocionId: item.promocionId ? Number(item.promocionId) : null,
      personalizacion: item.personalizacion ? {
        descripcionExtra: item.personalizacion.descripcionExtra || null,
        costoAdicional: Number(item.personalizacion.costoAdicional || 0),
        adicionalesSeleccionados: adicionalesCompletos  // OBJETOS COMPLETOS, NO IDs
      } : null
    };
  });

  const request = {
    usuarioId: Number(usuarioActual.usuarioId),
    detalles: detalles,
    subtotal: Number(this.subtotal.toFixed(2)),
    garantiaPagada: Number(this.garantia.toFixed(2)),
    resto: Number(this.resto.toFixed(2)),
    total: Number(this.subtotal.toFixed(2))
  };

  console.log('ENVIANDO PEDIDO:', JSON.stringify(request, null, 2));

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  this.http.post<any>(`${this.apiUrl}/pedidos`, request, { headers }).subscribe({
      next: (res) => {
        console.log('PEDIDO CREADO CON ÉXITO:', res);
        localStorage.setItem('pedido_confirmado_id', res.pedidoId.toString());
        localStorage.setItem('pago_garantia', JSON.stringify({
          garantia: this.garantia,
          resto: this.resto,
          subtotal: this.subtotal
        }));

        this.carritoService.vaciar();
        this.router.navigate(['/cliente/pago-garantia']);
      },
      error: (err) => {
        console.error('ERROR FINAL:', err);
        alert('Error: ' + (err.error?.message || 'No se pudo crear el pedido'));
      }
    });
}}
