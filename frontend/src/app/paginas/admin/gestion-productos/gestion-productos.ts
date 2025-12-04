import { Component, OnInit, inject, Renderer2, Inject } from '@angular/core';
import { CommonModule, TitleCasePipe, DecimalPipe, DOCUMENT } from '@angular/common';
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
  isLoading = true;
  errorMensaje: string | null = null;

  // Filtros y paginación
  buscar: string = '';
  categoriaFiltro: string = 'todas';
  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  categoriasDisponibles: string[] = [];

  // Modal
  productoSeleccionado: Producto | null = null;
  archivoSeleccionado: File | null = null;
  simularRuta: string = '';
  cloudinaryPublicId: string = '';

  private productoService = inject(ProductoService);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.isLoading = true;
    this.errorMensaje = null;
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.listaDeProductos = data;
        this.categoriasDisponibles = this.getCategoriasUnicas();
        this.filtrarYPaginar();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMensaje = 'Error al cargar productos. Revisa tu conexión.';
        this.isLoading = false;
      }
    });
  }

  getCategoriasUnicas(): string[] {
    const cats = this.listaDeProductos.map(p => p.categoria);
    return [...new Set(cats)].sort();
  }

  filtrarYPaginar(): void {
    let temp = [...this.listaDeProductos];

    if (this.buscar.trim()) {
      const term = this.buscar.toLowerCase();
      temp = temp.filter(p => p.nombre.toLowerCase().includes(term));
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

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas()) {
      this.paginaActual = nuevaPagina;
    }
  }

  crearProducto(): void {
    this.productoSeleccionado = {
      productoId: 0,
      nombre: '',
      descripcion: '',
      precioBase: 0,
      categoria: this.categoriasDisponibles[0] || 'torta',
      imagenUrl: '',
      cloudinaryPublicId: '',
      personalizable: false,
      estado: 'activo'
    };
    this.archivoSeleccionado = null;
    this.simularRuta = '';
    this.cloudinaryPublicId = '';
    this.abrirModal();
  }

  editarProducto(producto: Producto): void {
    this.productoSeleccionado = { ...producto };
    this.cloudinaryPublicId = producto.cloudinaryPublicId || '';
    this.simularRuta = producto.imagenUrl ? 'Imagen ya subida' : '';
    this.archivoSeleccionado = null;
    this.abrirModal();
  }

  private abrirModal(): void {
    this.renderer.addClass(this.document.body, 'modal-open');
  }

  cancelarEdicion(): void {
    this.productoSeleccionado = null;
    this.archivoSeleccionado = null;
    this.simularRuta = '';
    this.cloudinaryPublicId = '';
    this.renderer.removeClass(this.document.body, 'modal-open');
  }

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.archivoSeleccionado = input.files[0];
    this.simularRuta = this.archivoSeleccionado.name;

    this.isLoading = true;
    this.productoService.subirImagen(this.archivoSeleccionado).subscribe({
      next: (res: any) => {
        if (this.productoSeleccionado) {
          this.productoSeleccionado.imagenUrl = res.url;
          this.cloudinaryPublicId = res.public_id;
        }
        this.isLoading = false;
        alert('¡Foto subida a Cloudinary con éxito!');
      },
      error: (err) => {
        console.error('Error Cloudinary:', err);
        alert('Error al subir la imagen. Intenta otra vez.');
        this.isLoading = false;
      }
    });
  }

  guardarEdicion(): void {
    if (!this.productoSeleccionado) return;

    if (!this.productoSeleccionado.nombre.trim() || this.productoSeleccionado.precioBase <= 0) {
      alert('Nombre y precio son obligatorios');
      return;
    }

    this.isLoading = true;

    const productoParaEnviar = {
      ...this.productoSeleccionado,
      cloudinaryPublicId: this.cloudinaryPublicId || this.productoSeleccionado.cloudinaryPublicId
    };

    const observable = this.productoSeleccionado.productoId === 0
      ? this.productoService.crearProducto(productoParaEnviar)
      : this.productoService.actualizarProducto(this.productoSeleccionado.productoId, productoParaEnviar);

    observable.subscribe({
      next: () => {
        this.cargarProductos();
        this.cancelarEdicion();
        this.isLoading = false;
        alert('¡Producto guardado con éxito!');
      },
      error: (err) => {
        console.error(err);
        alert('Error al guardar el producto');
        this.isLoading = false;
      }
    });
  }

  eliminarProducto(producto: Producto): void {
    if (confirm(`¿Eliminar "${producto.nombre}" permanentemente?`)) {
      this.productoService.eliminarProducto(producto.productoId).subscribe({
        next: () => this.cargarProductos(),
        error: () => alert('Error al eliminar')
      });
    }
  }

  getEstadoClass(estado: string = ''): string {
    return estado === 'activo' ? 'badge bg-success' : 'badge bg-secondary';
  }
}