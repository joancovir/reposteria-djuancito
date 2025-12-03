import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink,Router } from '@angular/router';
import { CarritoService } from '../../../servicios/carrito';
import { PedidoService } from '../../../servicios/pedido';
import { GarantiaService } from '../../../servicios/garantia';
import { AutenticacionService } from '../../../servicios/autenticacion';
import { PedidoRequestDTO } from '../../../modelos/pedido-request-dto';
import { ItemCarrito } from '../../../modelos/item-carrito';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class Checkout {
  items: ItemCarrito[] = [];
  total = 0;
  porcentajeGarantia = 50;
  garantia = 0;
  resto = 0;

  constructor(
    private carrito: CarritoService,
    private pedidoService: PedidoService,
    private auth: AutenticacionService,
    private router: Router ,
    private garantiaService: GarantiaService
  ) {
    this.carrito.items$.subscribe(items => {
      this.items = items as ItemCarrito[];
      this.total = this.items.reduce((sum, i) => sum + i.precioUnitario * i.cantidad, 0);
      this.total = Math.round(this.total * 100) / 100;
      this.calcularGarantia();
    });

    this.garantiaService.obtener().subscribe(p => {
      this.porcentajeGarantia = p;
      this.calcularGarantia();
    });
  }

  calcularGarantia() {
    this.garantia = Math.round(this.total * this.porcentajeGarantia / 100 * 100) / 100;
    this.resto = Math.round((this.total - this.garantia) * 100) / 100;
  }

  confirmar() {
  if (!this.auth.estaLogueado()) {
    alert('Debes iniciar sesión para confirmar tu pedido');
    return;
  }

  const usuario = this.auth.obtenerUsuarioActual();
  if (!usuario?.usuarioId) {
    alert('Error: No se pudo obtener tu información');
    return;
  }

  // Mapeamos los items del carrito → DetalleRequestDTO
  const detalles = this.items.map(item => ({
    productoId: item.productoId || null,
    cantidad: item.cantidad,
    precioUnitario: item.precioUnitario,
    subtotal: item.precioUnitario * item.cantidad,
    // Si es torta personalizada, puedes agregar personalización aquí más adelante
  }));

  // ESTE ES EL DTO QUE TU BACKEND ESPERA EXACTAMENTE
  const pedidoDto: PedidoRequestDTO = {
    usuarioId: usuario.usuarioId,
    nota: `Pedido desde carrito - ${this.items.length} producto(s)`,
    detalles: detalles,
    subtotal: this.total,
    total: this.total,
    garantiaPagada: 0,        // ← se paga después
    resto: this.resto          // ← total - garantía
  };

  this.pedidoService.crear(pedidoDto).subscribe({
    next: (respuesta: any) => {
      // Guardamos el ID para el pago de garantía
      localStorage.setItem('pedido_actual_id', respuesta.pedidoId);
      localStorage.setItem('monto_garantia', this.garantia.toString());

      alert(`¡PEDIDO #${respuesta.pedidoId} CONFIRMADO!\nPaga S/ ${this.garantia} de garantía ahora`);

      this.carrito.vaciar();
      this.router.navigate(['/cliente/pago-garantia']); // ← redirige al pago
    },
    error: (err) => {
      console.error('Error al crear pedido:', err);
      alert('Error al procesar el pedido. Intenta de nuevo o contáctanos por WhatsApp.');
    }
  });
}
}