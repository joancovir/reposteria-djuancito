import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Importa CommonModule
import { RouterLink } from '@angular/router';
import { AutenticacionService } from '../../servicios/autenticacion'; // <-- Importa el servicio


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  isMenuOpen = false;

  constructor(public authService: AutenticacionService) {}

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.isMenuOpen = false; // Cierra el menú al cerrar sesión
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // --- NUEVO MÉTODO ---
  closeMenu(): void {
    this.isMenuOpen = false;
  }
}