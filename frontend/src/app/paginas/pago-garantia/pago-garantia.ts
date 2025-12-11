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
  imports: [CommonModule,RouterLink],
  templateUrl: './pago-garantia.html',
  styleUrls: ['./pago-garantia.css']
})
export class PagoGarantia implements OnInit {
  garantia = 0;
  resto = 0;
  subtotal = 0;
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
  
confirmarPagoGarantia() {
  if (!this.codigoOperacion || this.codigoOperacion.trim() === '') {
    alert('Por favor ingresa el código de operación');
    return;
  }

  const pedidoId = JSON.parse(localStorage.getItem('pago_garantia')!).pedidoId;

  this.http.post(`${this.apiUrl}/api/pedidos/${pedidoId}/pago-garantia`, {
    codigoOperacion: this.codigoOperacion.trim()
  }).subscribe({
    next: () => {
      this.mostrarExito();
    },
    error: () => {
      alert('Error al registrar el pago. Inténtalo de nuevo.');
    }
  });
}
  cargarDatosPedido() {
    const pagoStr = localStorage.getItem('pago_garantia');
    if (!pagoStr) {
      this.router.navigate(['/cliente/mi-pedido']);
      return;
    }

    const pago = JSON.parse(pagoStr);
    this.garantia = Number(pago.garantia) || 0;
    this.resto = Number(pago.resto) || 0;
    this.subtotal = Number(pago.subtotal) || 0;
  }

  cargarQrDesdeBackend() {
   this.http.get<QrPago[]>(`${this.apiUrl}/config/qr/activos`).subscribe({
      next: (data) => {
        this.qrList = data;
      },
      error: () => {
        alert('No se pudieron cargar los métodos de pago');
      }
    });
  }

  abrirQr(url: string) {
    this.qrAmpliado = url;
    const modalElement = document.getElementById('qrModal');
    if (modalElement) {
      const bootstrap = (window as any).bootstrap;
      if (bootstrap) {
        new bootstrap.Modal(modalElement).show();
      }
    }
  }

  mostrarExito() {
    const modalElement = document.getElementById('modalPagoExitoso');
    if (modalElement) {
      const bootstrap = (window as any).bootstrap;
      if (bootstrap) {
        new bootstrap.Modal(modalElement).show();
      }
    }

    setTimeout(() => {
      localStorage.removeItem('pago_garantia');
    }, 5000);
  }
}
