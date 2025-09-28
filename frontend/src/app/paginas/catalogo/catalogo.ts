import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../modelos/producto';
import { ProductoService } from '../../servicios/producto';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class Catalogo implements OnInit {

  listaDeProductos: Producto[] = [];

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
    // Llama al servicio, que devuelve un Observable, y nos suscribimos
    this.productoService.getProductos().subscribe(
      (data) => { // Si la llamada es exitosa
        this.listaDeProductos = data;
      },
      (error) => { // Si ocurre un error
        console.error('Error al obtener productos:', error);
      }
    );
  }
}