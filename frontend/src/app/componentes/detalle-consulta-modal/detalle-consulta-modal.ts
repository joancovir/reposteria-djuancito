import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Contacto } from '../../modelos/contacto';
import { ContactoService } from '../../servicios/contacto';

@Component({
  selector: 'app-detalle-consulta-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-consulta-modal.html',
  styleUrl: './detalle-consulta-modal.css'
})
export class DetalleConsultaModal implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contactoService = inject(ContactoService);

  consulta: Contacto | null = null;
  isLoading = true;
  errorMensaje: string | null = null;
  contactoId: number | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('contactoId');
      if (idParam) {
        this.contactoId = parseInt(idParam, 10);
        this.cargarDetalleConsulta(this.contactoId);
      } else {
        this.errorMensaje = 'ID de consulta no proporcionado.';
        this.isLoading = false;
        
      }
    });
  }


cargarDetalleConsulta(id: number): void {
    this.isLoading = true;
    this.errorMensaje = null;
    
    this.contactoService.obtenerPorId(id).subscribe({
      next: (data: Contacto) => {
        this.consulta = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
      }
    });
  }


  volverALaLista(): void {
    this.router.navigate(['/cliente/consultas']); 
  }
}