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
    
    tortaPersonalizada: Producto | undefined;
    tortaPredeterminada: Producto | undefined;

    // 💡 INYECTAR EL SERVICIO CORRECTO
    constructor(private productoFiltroService: ProductoFiltroService) { } 

    ngOnInit(): void {
        // Cargar el producto personalizable
        this.productoFiltroService.obtenerPersonalizables().subscribe(
            (data) => {
                if (data.length > 0) {
                    this.tortaPersonalizada = data[0];
                }
            }
        );
        // Cargar el producto predeterminado
        this.productoFiltroService.obtenerPredeterminados().subscribe(
            (data) => {
                if (data.length > 0) {
                    this.tortaPredeterminada = data[0]; 
                }
            }
        );
    }
}