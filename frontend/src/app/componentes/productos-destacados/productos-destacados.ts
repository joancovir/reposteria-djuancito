import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AutenticacionService } from '../../servicios/autenticacion'; 

@Component({
  selector: 'app-productos-destacados',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './productos-destacados.html',
  styleUrls: ['./productos-destacados.css']
})
export class ProductosDestacados{
    public galeriaLink: string[] = []; 
constructor(private authService: AutenticacionService) {
  }

  ngOnInit() {
    this.actualizarRutaGaleria();
  }

  actualizarRutaGaleria() {
    if (this.authService.estaLogueado()) {
      this.galeriaLink = ['/cliente/productos-realizados'];
    } else {
      this.galeriaLink = ['/productos-realizados'];
    }
  }

  
}
