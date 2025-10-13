import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AutenticacionService } from '../../servicios/autenticacion'; 

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {

constructor(public authService: AutenticacionService) {} 

  cerrarSesion(): void {
    this.authService.cerrarSesion();
  }
}
