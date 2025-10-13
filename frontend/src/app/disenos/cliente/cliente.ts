import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AutenticacionService } from '../../servicios/autenticacion';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './cliente.html',
  styleUrl: './cliente.css'
})
export class ClienteComponent {
  constructor(public authService: AutenticacionService) {}
}