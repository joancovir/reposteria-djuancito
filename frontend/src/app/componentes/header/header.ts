import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../servicios/carrito';
import { AutenticacionService } from '../../servicios/autenticacion'; 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit {
  isMenuOpen = false;
  cantidadItems = 0;

  constructor(
    public authService: AutenticacionService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.carritoService.items$.subscribe(items => {
      this.cantidadItems = items.reduce((total, item) => total + item.cantidad, 0);
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.closeMenu();
  }
}