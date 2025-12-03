import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-confirmar-pedido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmar-pedido.html'
})
export class ConfirmarPedidoPage implements OnInit {
  pedido: any = {};
  private apiUrl = 'http://localhost:8080/api/pedidos';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

 ngOnInit() {
  const pedido = localStorage.getItem('pedido_pendiente');
  if (pedido) {
    this.pedido = JSON.parse(pedido);
    localStorage.removeItem('pedido_pendiente'); 
  }else {
    this.router.navigate(['/cliente/mi-pedido']);
}
}
irAPago() {
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    alert('No estás autenticado');
    this.router.navigate(['/iniciar-sesion']);
    return;
  }

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const request = {
    usuarioId: this.pedido.usuarioId,
    detalles: this.pedido.items.map((item: any) => ({
      productoId: item.productoId,
      cantidad: item.cantidad,
      precioUnitario: item.precio || item.precioUnitario || 0,
      promocionId: item.promocionId || null,        // ← NUEVO: enviar promoción
      subtotal: (item.precio || item.precioUnitario || 0) * item.cantidad   // ← CLAVE
    }))
  };

  console.log('ENVIANDO PEDIDO:', request); // ← Vas a ver el error aquí

  this.http.post<any>(`${this.apiUrl}/confirmar`, request, { headers })
    .subscribe({
      next: (res) => {
        localStorage.setItem('pedido_confirmado_id', res.pedidoId);
        localStorage.setItem('pago_garantia', JSON.stringify({
          garantia: this.pedido.garantia,
          resto: this.pedido.resto,
          subtotal: this.pedido.subtotal
        }));
        localStorage.removeItem('pedido_pendiente');
        alert('¡Pedido confirmado exitosamente!');
        this.router.navigate(['/cliente/pago-garantia']);
      },
      error: (err) => {
        console.error('Error completo:', err);
        alert('Error: ' + (err.error?.message || JSON.stringify(err.error) || 'Datos inválidos'));
      }
    });
}
  volver() {
    this.router.navigate(['/cliente/mi-pedido']);
  }
}