import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resena } from '../../modelos/resena';
import { ResenaService } from '../../servicios/resena';

@Component({
  selector: 'app-resenas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resenas.html',
  styleUrl: './resenas.css'
})
export class Resenas implements OnInit {
  listaDeResenas: Resena[] = [];
  indiceActual = 0;

  constructor(private resenaService: ResenaService) {}

  ngOnInit(): void {
    this.resenaService.getResenasPublicas().subscribe(
      (data) => {
        this.listaDeResenas = data;
      },
      (error) => console.error('Error al obtener reseñas:', error)
    );
  }

  get resenaActual(): Resena | null {
    return this.listaDeResenas.length ? this.listaDeResenas[this.indiceActual] : null;
  }

  siguiente(): void {
    if (this.indiceActual < this.listaDeResenas.length - 1) {
      this.indiceActual++;
    } else {
      this.indiceActual = 0; // 🔁 bucle infinito hacia adelante
    }
  }

  anterior(): void {
    if (this.indiceActual > 0) {
      this.indiceActual--;
    } else {
      this.indiceActual = this.listaDeResenas.length - 1; // 🔁 bucle infinito hacia atrás
    }
  }
}
