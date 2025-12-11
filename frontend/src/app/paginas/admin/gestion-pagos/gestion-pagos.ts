import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoService } from '../../../servicios/pago';
import { Pago, EstadoPago, MetodoPago } from '../../../modelos/pago';

@Component({
  selector: 'app-gestion-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-pagos.html',
  styleUrls: ['./gestion-pagos.css']
})
export class GestionPagos implements OnInit {
  pagos: Pago[] = [];
  pagosFiltrados: Pago[] = [];
  cargando = true;
  buscar = '';
  estadoFiltro: string = 'todos';
  paginaActual = 1;
  itemsPorPagina = 10;

  constructor(private pagoService: PagoService) {}

  ngOnInit(): void {
    this.cargarPagos();
  }

  cargarPagos() {
    this.cargando = true;
    this.pagoService.obtenerTodos().subscribe({
      next: (data) => {
        this.pagos = data;
        this.filtrarYPaginar();
        this.cargando = false;
      },
      error: () => {
        alert('Error al cargar pagos');
        this.cargando = false;
      }
    });
  }

  filtrarYPaginar() {
    let temp = [...this.pagos];

    if (this.buscar.trim()) {
      const term = this.buscar.toLowerCase();
      temp = temp.filter(p =>
        p.pagoId.toString().includes(term) ||
        p.pedidoId?.toString().includes(term) ||
        p.codigoOperacion?.toLowerCase().includes(term)
      );
    }

    if (this.estadoFiltro !== 'todos') {
      temp = temp.filter(p => p.estado === this.estadoFiltro);
    }

    this.pagosFiltrados = temp;
    this.paginaActual = 1;
  }

  get pagosPaginados() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.pagosFiltrados.slice(inicio, inicio + this.itemsPorPagina);
  }

  totalPaginas() {
    return Math.ceil(this.pagosFiltrados.length / this.itemsPorPagina);
  }

  cambiarEstado(pago: Pago, nuevoEstado: 'validado' | 'rechazado') {
    const accion = nuevoEstado === 'validado' ? 'VALIDAR' : 'RECHAZAR';
    if (!confirm(`¿Estás seguro de ${accion} este pago de S/ ${pago.montoAbonado}?`)) return;

    this.pagoService.actualizarEstadoPago(pago.pagoId, nuevoEstado).subscribe({
      next: (res) => {
        pago.estado = res.estado;
        alert(`Pago ${accion.toLowerCase()} exitosamente`);

        // Si se valida y aún está en PENDIENTE, intenta detectar YAPE/PLIN
        if (nuevoEstado === 'validado' && pago.metodo === 'PENDIENTE' && pago.codigoOperacion) {
          const nuevoMetodo = pago.codigoOperacion.toUpperCase().includes('YAPE') ? 'yape' : 'plin';
          pago.metodo = nuevoMetodo;
          this.actualizarMetodo(pago);
        }
      },
      error: () => alert('Error al actualizar estado')
    });
  }

  // NUEVO: Permite cambiar manualmente el método
  actualizarMetodo(pago: Pago) {
    if (pago.estado === 'validado' && pago.metodo === 'PENDIENTE') {
      alert('No se puede cambiar método una vez validado');
      this.cargarPagos();
      return;
    }

    this.pagoService.actualizarMetodo(pago.pagoId, pago.metodo).subscribe({
      next: () => {
        // Nada, ya se actualizó en pantalla
      },
      error: () => {
        alert('Error al actualizar método');
        this.cargarPagos();
      }
    });
  }

  estadoColor(estado: EstadoPago | string): string {
    const map: Record<string, string> = {
      pendiente_validacion: 'bg-warning text-dark',
      validado: 'bg-success',
      rechazado: 'bg-danger'
    };
    return map[estado] || 'bg-secondary';
  }

  refrescar() {
    this.cargarPagos();
  }
}
