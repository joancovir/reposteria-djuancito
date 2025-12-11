import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../src/environments/environment';

interface QrPago {
  id: number;
  tipo: string;
  imagenUrl: string;
  telefono: string;
  nombrePropietario?: string;
}

@Component({
  selector: 'app-pago-garantia',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pago-garantia.html',
  styleUrls: ['./pago-garantia.css']
})
export class PagoGarantia implements OnInit {
  garantia = 0;
  resto = 0;
  subtotal = 0;
  pedidoId: number | null = null;   // ← AÑADIDO
  qrList: QrPago[] = [];
  qrAmpliado = '';
  codigoOperacion = '';
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarDatosPedido();
    this.cargarQrDesdeBackend();
  }

  cargarDatosPedido() {
    const pagoStr = localStorage.getItem('pago_garantia');
    if (!pagoStr) {
      alert('No hay pedido pendiente');
      this.router.navigate(['/cliente/mi-pedido']);
      return;
    }

    try {
      const pago = JSON.parse(pagoStr);
      this.pedidoId = pago.pedidoId || null;
      this.garantia = Number(pago.garantia) || 0;
      this.resto = Number(pago.resto) || 0;
      this.subtotal = Number(pago.subtotal) || 0;

      if (!this.pedidoId) {
        alert('Error: no se encontró el ID del pedido');
        this.router.navigate(['/cliente/mi-pedido']);
      }
    } catch (e) {
      alert('Datos corruptos, vuelve a intentar');
      this.router.navigate(['/cliente/mi-pedido']);
    }
  }

  confirmarPagoGarantia() {
    if (!this.codigoOperacion || this.codigoOperacion.trim() === '') {
      alert('Por favor ingresa el código de operación');
      return;
    }

    if (!this.pedidoId) {
      alert('Error: ID de pedido no válido');
      return;
    }

    this.http.post(`${this.apiUrl}/api/pedidos/${this.pedidoId}/pago-garantia`, {
      codigoOperacion: this.codigoOperacion.trim()
    }).subscribe({
      next: () => {
        this.mostrarExito();
      },
      error: (err) => {
        console.error(err);
        alert('Error al registrar el pago: ' + (err.error?.message || 'Inténtalo de nuevo'));
      }
    });
  }

  // ... el resto (cargarQrDesdeBackend, abrirQr, mostrarExito) queda IGUAL
  cargarQrDesdeBackend() {
    this.http.get<QrPago[]>(`${this.apiUrl}/config/qr/activos`).subscribe({
      next: (data) => this.qrList = data,
      error: () => alert('No se pudieron cargar los métodos de pago')
    });
  }

  abrirQr(url: string) {
    this.qrAmpliado = url;
    const modal = document.getElementById('qrModal');
    if (window as any).bootstrap?.Modal.getOrCreateInstance(modal)?.show();
  }

  mostrarExito() {
    const modal = document.getElementById('modalPagoExitoso');
    (window as any).bootstrap?.Modal.getOrCreateInstance(modal)?.show();
    setTimeout(() => localStorage.removeItem('pago_garantia'), 5000);
  }
}
