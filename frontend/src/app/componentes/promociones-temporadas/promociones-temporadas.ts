
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Promocion } from '../../modelos/promocion'; 
import { Temporada } from '../../modelos/temporada'; 
import { PromocionService } from '../../servicios/promocion'; 
import { TemporadaService } from '../../servicios/temporada'; 
import { RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-promociones-temporadas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './promociones-temporadas.html',
  styleUrls: ['./promociones-temporadas.css']
})
export class PromocionesTemporadas implements OnInit {

  todasLasPromociones: Promocion[] = [];
  temporadasActivas: Temporada[] = [];
  promocionesFiltradas: Promocion[] = [];

  filtroCategoria: string = 'todas';
  filtroTemporadaId: number | null = null;
  categoriasDisponibles: string[] = ['torta', 'postre', 'bocadito']; 

  constructor(
    private promocionService: PromocionService, 
    private temporadaService: TemporadaService
  ) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    // 1. Cargar promociones activas
    this.promocionService.getPromocionesActivas().subscribe(
      data => {
        this.todasLasPromociones = data;
        this.promocionesFiltradas = data; 
      },
      error => console.error('Error al cargar promociones:', error)
    );

    // 2. Cargar temporadas activas para los filtros
    this.temporadaService.getTemporadasActivas().subscribe(
      data => {
        this.temporadasActivas = data;
      },
      error => console.error('Error al cargar temporadas:', error)
    );
  }

  aplicarFiltros(): void {
  let tempPromos = this.todasLasPromociones;

  // FILTRAR POR TEMPORADA
  if (this.filtroTemporadaId !== null) {
    tempPromos = tempPromos.filter(promo => promo.temporadaId === this.filtroTemporadaId);
  }

  // FILTRAR POR CATEGORÍA
  if (this.filtroCategoria !== 'todas') {
    tempPromos = tempPromos.filter(promo =>
      promo.promocionProductos?.some(pp => 
        pp.producto.categoria.toLowerCase() === this.filtroCategoria.toLowerCase()
      )
    );
  }

  this.promocionesFiltradas = tempPromos;
}
  limpiarFiltroTemporada(): void {
    this.filtroTemporadaId = null;
    this.aplicarFiltros();
  }
}