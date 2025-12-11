import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './pago-garantia.html',
  styleUrls: ['./pago-garantia.css']
})
export class PagoGarantia implements OnInit {
  garantia = 0;
  resto = 0;
  pedidoId: number | null = null;
  qrList: QrPago[] = [];
  qrAmpliado = '';
  codigoOperacion = '';
  metodoSeleccionado: 'yape' | 'plin' = 'yape'; // NUEVO

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

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
      if (!this.pedidoId) throw new Error();
    } catch (e) {
      alert('Error en datos del pedido');
      this.router.navigate(['/cliente/mi-pedido']);
    }
  }

  cargarQrDesdeBackend() {
    this.http.get<QrPago[]>(`${this.apiUrl}/config/qr/activos`).subscribe({
      next: (data) => this.qrList = data,
      error: () => alert('No se pudieron cargar los métodos de pago')
    });
  }

  confirmarPagoGarantia() {
    if (!this.codigoOperacion?.trim()) {
      alert('Por favor ingresa el código de operación');
      return;
    }
    if (!this.pedidoId) {
      alert('Error: pedido no válido');
      return;
    }

    this.http.post(`${this.apiUrl}/pedidos/${this.pedidoId}/pago-garantia`, {
      codigoOperacion: this.codigoOperacion.trim(),
      metodo: this.metodoSeleccionado  // GUARDAMOS SI FUE YAPE O PLIN
    }).subscribe({
      next: () => this.mostrarExito(),
      error: (err) => {
        alert('Error: ' + (err.error?.message || 'Inténtalo más tarde'));
      }
    });
  }

  abrirQr(url: string) {
    this.qrAmpliado = url;
    const modal = document.getElementById('qrModal');
    if (modal) {
      const bs = (window as any).bootstrap;
      new bs.Modal(modal).show();
    }
  }

  mostrarExito() {
    const modal = document.getElementById('modalPagoExitoso');
    if (modal) {
      const bs = (window as any).bootstrap;
      new bs.Modal(modal).show();
    }
    localStorage.removeItem('pago_garantia');
  }
}
