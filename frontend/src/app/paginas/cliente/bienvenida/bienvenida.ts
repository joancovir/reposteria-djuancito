
import { Component, OnInit, inject } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router';
import { AutenticacionService } from '../../../servicios/autenticacion';

interface ActividadReciente {
  tipo: 'pedido' | 'reseña' | 'consulta' | 'usuario';
  descripcion: string;
  tiempo: string; 
  iconoColor: string; 
}

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink
  ],
  templateUrl: './bienvenida.html',
  styleUrl: './bienvenida.css'
})
export class Bienvenida implements OnInit {
  
  nombreUsuario = '';
  actividadesRecientes: ActividadReciente[] = []; 
  isLoadingActividad = true; 

  // Inyecta el servicio
  private authService = inject(AutenticacionService); 

  ngOnInit(): void {
    const usuario = this.authService.obtenerUsuarioActual();
    if (usuario) {
      this.nombreUsuario = usuario.nombre;
    }
    
  }


}