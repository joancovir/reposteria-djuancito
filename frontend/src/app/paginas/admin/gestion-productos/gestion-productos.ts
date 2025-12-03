import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, TitleCasePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../../modelos/producto';
import { ProductoService } from '../../../servicios/producto';

@Component({
  selector: 'app-gestion-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe, DecimalPipe],
  templateUrl: './gestion-productos.html',
  styleUrls: ['./gestion-productos.css']
})
export class GestionProductos implements OnInit {

  listaDeProductos: Producto[] = [];
  productosFiltrados: Producto[] = [];  
  // === ESTADOS ===
  isLoading = true;
  errorMensaje: string | null = null;

  buscar: string = '';
  categoriaFiltro: string = 'todas';
  paginaActual: number = 1;
  itemsPorPagina: number = 10;

  productoSeleccionado: Producto | null = null;
  archivoSeleccionado: File | null = null;
  simularRuta: string = '';

  categoriasDisponibles: string[] = ['torta', 'postre', 'bocadito'];

  private productoService = inject(ProductoService);

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.isLoading = true;
    this.errorMensaje = null;
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.listaDeProductos = data;
        this.filtrarYPaginar(); // ← Aplica filtros al cargar
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.errorMensaje = 'No se pudieron cargar los productos. Revise la conexión.';
        this.isLoading = false;
      }
    });
  }

  // === FILTROS Y PAGINACIÓN ===
  filtrarYPaginar(): void {
    let temp = [...this.listaDeProductos];

    if (this.buscar.trim()) {
      const term = this.buscar.toLowerCase();
      temp = temp.filter(p =>
        p.nombre.toLowerCase().includes(term) ||
        (p.descripcion?.toLowerCase().includes(term) ?? false)
      );
    }

    if (this.categoriaFiltro !== 'todas') {
      temp = temp.filter(p => p.categoria === this.categoriaFiltro);
    }

    this.productosFiltrados = temp;
    this.paginaActual = 1;
  }

  get productosPaginados(): Producto[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.productosFiltrados.slice(inicio, inicio + this.itemsPorPagina);
  }

  totalPaginas(): number {
    return Math.ceil(this.productosFiltrados.length / this.itemsPorPagina);
  }

  // === CRUD ===
  crearProducto(): void {
    this.productoSeleccionado = {
      productoId: 0,
      nombre: '',
      categoria: 'torta',
      precioBase: 0,
      personalizable: false,
      estado: 'activo',
      imagenUrl: ''
    };
    this.archivoSeleccionado = null;
    this.simularRuta = '';
    this.errorMensaje = null;
  }

  editarProducto(producto: Producto): void {
    this.productoSeleccionado = { ...producto };
    this.simularRuta = producto.imagenUrl ? producto.imagenUrl.split('/').pop() || '' : '';
    this.archivoSeleccionado = null;
    this.errorMensaje = null;
  }

  cancelarEdicion(): void {
    this.productoSeleccionado = null;
    this.archivoSeleccionado = null;
    this.simularRuta = '';
    this.errorMensaje = null;
  }

  guardarEdicion(): void {
    if (!this.productoSeleccionado) return;

    if (!this.productoSeleccionado.nombre.trim() || this.productoSeleccionado.precioBase <= 0) {
      this.errorMensaje = 'Nombre y precio base son obligatorios.';
      return;
    }

    this.isLoading = true;
    const esNuevo = this.productoSeleccionado.productoId === 0;

    const observable = esNuevo
      ? this.productoService.crearProducto(this.productoSeleccionado)
      : this.productoService.actualizarProducto(this.productoSeleccionado.productoId, this.productoSeleccionado);

    observable.subscribe({
      next: () => {
        this.cargarProductos();
        this.cancelarEdicion();
        alert(esNuevo ? 'Producto creado con éxito!' : 'Producto actualizado!');
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        this.errorMensaje = 'Error al guardar el producto.';
        this.isLoading = false;
      }
    });
  }

  eliminarProducto(producto: Producto): void {
    if (confirm(`¿Seguro que deseas eliminar "${producto.nombre}"?`)) {
      this.isLoading = true;
      this.productoService.eliminarProducto(producto.productoId).subscribe({
        next: () => this.cargarProductos(),
        error: (err) => {
          this.errorMensaje = 'Error al eliminar el producto.';
          this.isLoading = false;
        }
      });
    }
  }

  // === IMAGEN ===
  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      this.archivoSeleccionado = null;
      this.simularRuta = '';
      return;
    }

    this.archivoSeleccionado = input.files[0];
    this.simularRuta = this.archivoSeleccionado.name;

    if (this.productoSeleccionado) {
      const cat = this.productoSeleccionado.categoria;
      const carpeta = this.categoriasDisponibles.includes(cat) ? cat : 'otros';
      this.productoSeleccionado.imagenUrl = `assets/imagenes/${carpeta}/${this.archivoSeleccionado.name}`;
    }
  }

  getEstadoClass(estado: string = ''): string {
    return estado === 'activo' ? 'estado-activo' : 'estado-inactivo';
  }
}