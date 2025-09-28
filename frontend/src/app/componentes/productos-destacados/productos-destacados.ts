// productos-destacados.ts (Modificado)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Producto } from '../../modelos/producto';
import { ProductoFiltroService } from '../../servicios/producto-filtro'; // <-- ¡Importar!

@Component({
  selector: 'app-productos-destacados',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './productos-destacados.html',
  styleUrl: './productos-destacados.css'
})
export class ProductosDestacados implements OnInit {
    
    // Variables para almacenar el primer producto de cada filtro
    tortaPersonalizada: Producto | undefined;
    tortaPredeterminada: Producto | undefined;

    constructor(private productoFiltroService: ProductoFiltroService) { } // Inyectar

    ngOnInit(): void {
        // Cargar el producto personalizable para la primera tarjeta
        this.productoFiltroService.obtenerPersonalizables().subscribe(
            (data) => {
                if (data.length > 0) {
                    this.tortaPersonalizada = data[0]; // Tomar el primer producto
                }
            }
        );

        // Cargar el producto predeterminado para la segunda tarjeta
        this.productoFiltroService.obtenerPredeterminados().subscribe(
            (data) => {
                if (data.length > 0) {
                    this.tortaPredeterminada = data[0]; // Tomar el primer producto
                }
            }
        );
    }
}