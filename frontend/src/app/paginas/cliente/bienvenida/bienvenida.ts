import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AutenticacionService } from '../../../servicios/autenticacion';

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './bienvenida.html',
  styleUrl: './bienvenida.css'
})
export class BienvenidaComponent implements OnInit {
  nombreUsuario = '';

  constructor(private authService: AutenticacionService) {}

  ngOnInit(): void {
    const usuario = this.authService.obtenerUsuarioActual();
    if (usuario) {
      this.nombreUsuario = usuario.nombre;
    }
  }
}