import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AutenticacionService } from '../../servicios/autenticacion';
import { CarritoService } from '../../servicios/carrito';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './cliente.html',
  styleUrl: './cliente.css'
})
export class ClienteComponent implements OnInit {
  cantidadCarrito = 0;

  constructor(
    public authService: AutenticacionService,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    this.carritoService.items$.subscribe(items => {
      this.cantidadCarrito = items.reduce((sum, item) => sum + item.cantidad, 0);
    });
  }
}