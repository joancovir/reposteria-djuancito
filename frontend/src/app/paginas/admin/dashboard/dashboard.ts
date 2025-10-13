import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true, // <-- Asegúrate de que sea standalone
  imports: [], // <-- Vacío o con los módulos que necesite el dashboard
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard { // <-- Usa el nombre de clase correcto

}