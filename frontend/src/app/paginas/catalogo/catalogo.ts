import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../modelos/producto';
import { ProductoService } from '../../servicios/producto';
import { CarritoService } from '../../servicios/carrito';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { ModalAdicionalesComponent } from '../../componentes/modal-adicionales/modal-adicionales';
import { Adicional } from '../../modelos/adicional';
import { AdicionalService } from '../../servicios/adicional';
import { RouterLink, ActivatedRoute, ParamMap } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { Observable } from 'rxjs';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [
    CommonModule, 
    ModalModule, 
    RouterLink, 
    FormsModule 
  ],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class CatalogoComponent implements OnInit {

  listaDeProductos: Producto[] = [];
  listaDeAdicionales: Adicional[] = [];
  bsModalRef?: BsModalRef;
  
  filtroActivo: string = '';
  searchTerm: string = '';
  isLoading = true;

  // 🔹 PAGINACIÓN
  paginaActual: number = 1;
  productosPorPagina: number = 8;

  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService);
  private adicionalService = inject(AdicionalService);
  private modalService = inject(BsModalService);
  private route = inject(ActivatedRoute);

  constructor() {}

  ngOnInit(): void {
    this.adicionalService.getAdicionales().subscribe(data => this.listaDeAdicionales = data);

    this.route.paramMap.subscribe((params: ParamMap) => {
      const filtroUrl = params.get('filtro');
      this.isLoading = true;
      if (filtroUrl) {
        this.filtroActivo = filtroUrl;
        this.ejecutarFiltro(this.filtroActivo);
      } else {
        this.filtroActivo = '';
        this.ejecutarFiltro('');
      }
    });
  }

  ejecutarFiltro(filtro: string) {
    this.isLoading = true;
    let servicioObservable: Observable<Producto[]>;

    switch(filtro) {
      case 'personalizable':
        servicioObservable = this.productoService.getProductosPersonalizables();
        break;
      case 'predeterminada':
        servicioObservable = this.productoService.getProductosPredeterminados();
        break;
      case 'torta':
      case 'postre':
      case 'bocadito':
        servicioObservable = this.productoService.getProductosPorCategoria(filtro);
        break;
      default: 
        servicioObservable = this.productoService.getProductos();
        break;
    }

    servicioObservable.subscribe((data: Producto[]) => {
      this.listaDeProductos = data;
      this.paginaActual = 1; // reinicia a la primera página
      this.isLoading = false;
    });
  }

  filtrarProductos(event: any) {
    this.filtroActivo = event.target.value;
    this.searchTerm = ''; 
    this.ejecutarFiltro(this.filtroActivo);
  }

  buscarProductos(): void {
    this.isLoading = true;
    if (this.searchTerm.trim() === '') {
      this.ejecutarFiltro(this.filtroActivo);
    } else {
      this.productoService.getProductosPorNombre(this.searchTerm).subscribe((data: Producto[]) => {
        this.listaDeProductos = data;
        this.filtroActivo = ''; 
        this.paginaActual = 1; 
        this.isLoading = false;
      });
    }
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregarAlCarrito(producto);
    window.dispatchEvent(new CustomEvent('agregar-al-carrito', {
      detail: `${producto.nombre} agregado al carrito`
    }));
  }

  abrirModalAdicionales() {
    const initialState = { adicionales: this.listaDeAdicionales };
    this.bsModalRef = this.modalService.show(ModalAdicionalesComponent, { initialState });
  }

  // 🔹 MÉTODOS DE PAGINACIÓN
  get totalPaginas(): number {
    return Math.ceil(this.listaDeProductos.length / this.productosPorPagina);
  }

  get productosPaginados(): Producto[] {
    const inicio = (this.paginaActual - 1) * this.productosPorPagina;
    return this.listaDeProductos.slice(inicio, inicio + this.productosPorPagina);
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }
  }
}
