import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-bootstrap/carousel'; // Importa el módulo del carrusel
import { Promocion } from '../../modelos/promocion';
import { PromocionService } from '../../servicios/promocion';

@Component({
  selector: 'app-carrusel-principal',
  standalone: true,
  imports: [CommonModule, CarouselModule], // Añade CarouselModule
  templateUrl: './/carrusel-principal.html',
  styleUrl: './/carrusel-principal.css'
})
export class CarruselPrincipalComponent implements OnInit {

  promociones: Promocion[] = [];

  constructor(private promocionService: PromocionService) {}

  ngOnInit(): void {
    this.promocionService.getPromocionesActivas().subscribe(data => {
      this.promociones = data;
    });
  }
}