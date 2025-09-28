// resenas.ts (Código modificado)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngFor
import { Resena } from '../../modelos/resena'; // Importa el modelo
import { ResenaService } from '../../servicios/resena'; // Importa el servicio

@Component({
  selector: 'app-resenas',
  // Debes añadir CommonModule si usas *ngFor en el standalone component
  imports: [CommonModule], 
  templateUrl: './resenas.html',
  styleUrl: './resenas.css'
})
export class Resenas implements OnInit { // Implementa OnInit
    
    listaDeResenas: Resena[] = []; // Variable para guardar la lista

    constructor(private resenaService: ResenaService) { } // Inyecta el servicio

    ngOnInit(): void {
      this.resenaService.getResenas().subscribe(
        (data) => {
          // Asigna la respuesta de la API a la lista
          this.listaDeResenas = data; 
        },
        (error) => {
          console.error('Error al obtener reseñas:', error);
        }
      );
    }
}
