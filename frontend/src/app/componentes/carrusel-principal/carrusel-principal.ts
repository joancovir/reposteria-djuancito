import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { Promocion } from '../../modelos/promocion';
import { PromocionService } from '../../servicios/promocion';
import { RouterLink } from '@angular/router'; 
@Component({
  selector: 'app-carrusel-principal',
  standalone: true,
  imports: [CommonModule, CarouselModule, RouterLink], 
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