
import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ProductoFiltro, ProductoRealizado } from '../../servicios/producto-filtro'; 

export type CategoriaRealizado = 'torta' | 'postre' | 'bocadito' | 'otros';

@Component({
  selector: 'app-productos-realizados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos-realizados.html',
  styleUrl: './productos-realizados.css' 
})
export class ProductosRealizados implements OnInit {

  // --- Datos de la Galería ---
  listaCompletaProductos: ProductoRealizado[] = [];
  productosFiltrados: ProductoRealizado[] = [];
  
  filtroSeleccionado: CategoriaRealizado | 'todos' = 'todos';
  categoriasDisponibles: (CategoriaRealizado | 'todos')[] = ['todos', 'torta', 'postre', 'bocadito'];
  
  // --- Variables de Paginación ---
  productosMostrados: ProductoRealizado[] = [];
  paginaActual: number = 1;
  productosPorPagina: number = 5; 
  totalPaginas: number = 0;

  // --- Variables de Zoom
  imagenZoom: string = '';
  nombreZoom: string = '';

  constructor(
    private location: Location, 
    private ProductoFiltro: ProductoFiltro
  ) { }

  ngOnInit(): void {
    this.cargarProductosRealizados();
  }


  cargarProductosRealizados(): void {
    this.ProductoFiltro.obtenerProductosRealizados().subscribe({
      next: (data) => {
        this.listaCompletaProductos = data;
        this.aplicarFiltro('todos');
      },
      error: (err) => {
        console.error('Error al cargar productos realizados:', err);
      }
    });
  }


  volver(): void {
    this.location.back();
  }

  aplicarFiltro(categoria: CategoriaRealizado | 'todos'): void {
    this.filtroSeleccionado = categoria;

    if (categoria === 'todos') {
      this.productosFiltrados = [...this.listaCompletaProductos];
    } else {
      this.productosFiltrados = this.listaCompletaProductos.filter(
        (producto) => producto.categoria === categoria
      );
    }
    
    this.paginaActual = 1;
    this.calcularPaginacion();
    this.actualizarProductosMostrados();
  }

  getNombreFiltro(filtro: CategoriaRealizado | 'todos'): string {
    switch (filtro) {
      case 'torta': return 'Tortas';
      case 'postre': return 'Postres';
      case 'bocadito': return 'Bocaditos';
      case 'otros': return 'Otros';
      case 'todos':
      default: return 'Todos';
    }
  }


  private calcularPaginacion(): void {
    this.totalPaginas = Math.ceil(this.productosFiltrados.length / this.productosPorPagina);
  }

  private actualizarProductosMostrados(): void {
    const inicio = (this.paginaActual - 1) * this.productosPorPagina;
    const fin = inicio + this.productosPorPagina;
    this.productosMostrados = this.productosFiltrados.slice(inicio, fin);
  }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarProductosMostrados();
    }
  }

  
  mostrarZoom(producto: ProductoRealizado): void {
    this.imagenZoom = producto.imagenUrl;
    this.nombreZoom = producto.nombre;
  }
}