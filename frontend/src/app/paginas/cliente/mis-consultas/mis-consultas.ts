import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; 
import { Contacto } from '../../../modelos/contacto'; 
import { ContactoService } from '../../../servicios/contacto';

// --- Importaciones para el Formulario ---
import { FormsModule } from '@angular/forms'; 

// Definimos el tipo estricto para los motivos.
type Motivo = 'general' | 'cotizacion' | 'soporte';

// Interfaz para el objeto motivo en la lista
interface MotivoItem {
    valor: Motivo;
    nombre: string;
}

@Component({
  selector: 'app-mis-consultas',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './mis-consultas.html',
  styleUrl: './mis-consultas.css'
})
export class MisConsultas implements OnInit {

  // --- Propiedades Existentes ---
  consultas: Contacto[] = [];
  isLoading = true;
  errorMensaje: string | null = null;
  private contactoService = inject(ContactoService);

  // --- Propiedades para el Formulario (Se mantienen aquí) ---
  mostrarFormulario = false; 
  nuevoMensaje: string = ''; 
  motivoSeleccionado: Motivo = 'general'; 
  isSending = false; 
  enviadoExito = false; 

  // Lista de motivos, ahora con su interfaz
  motivos: MotivoItem[] = [
    { valor: 'cotizacion', nombre: 'Cotización' },
    { valor: 'soporte', nombre: 'Soporte Técnico' },
    { valor: 'general', nombre: 'Consulta General' },
  ];
  
  ngOnInit(): void {
    this.cargarConsultas();
  }

  cargarConsultas(): void {
    // ... (El resto de la función se mantiene igual)
    this.isLoading = true;
    this.errorMensaje = null;
    this.contactoService.obtenerMiHistorial().subscribe({
      next: (data: Contacto[]) => { 
        this.consultas = data;
        this.isLoading = false;
        this.enviadoExito = false;
      },
      error: (err: any) => { 
        console.error('Error al cargar las consultas:', err);
        this.errorMensaje = 'No se pudieron cargar tus consultas.';
        this.isLoading = false;
      }
    });
  }

  toggleFormulario(): void {
    // ... (El resto de la función se mantiene igual)
    this.mostrarFormulario = !this.mostrarFormulario;
    this.nuevoMensaje = ''; 
    this.motivoSeleccionado = 'general';
    this.enviadoExito = false;
  }

  enviarNuevaConsulta(): void {
    // ... (El resto de la función se mantiene igual)
    const selectedMotivo = this.motivoSeleccionado as Motivo; 
    
    if (this.nuevoMensaje.trim().length < 10) {
      console.error('El mensaje es muy corto.'); 
      this.errorMensaje = 'El mensaje debe tener al menos 10 caracteres.';
      return;
    }
    if (!selectedMotivo) {
        console.error('El motivo no está seleccionado.');
        this.errorMensaje = 'Por favor, selecciona un motivo para tu consulta.';
        return;
    }

    this.isSending = true;
    this.errorMensaje = null;

    const nuevaConsulta: Partial<Contacto> = {
      motivo: selectedMotivo, 
      mensaje: this.nuevoMensaje.trim(),
    };

    this.contactoService.registrar(nuevaConsulta).subscribe({
      next: (respuesta: Contacto) => { 
        this.isSending = false;
        this.enviadoExito = true;
        this.mostrarFormulario = false; 
        this.nuevoMensaje = ''; 
        this.motivoSeleccionado = 'general';
        this.cargarConsultas(); 
      },
      error: (err: any) => { 
        console.error('Error al enviar la consulta:', err);
        this.errorMensaje = 'Error al enviar la consulta. Inténtalo de nuevo.';
        this.isSending = false;
      }
    });
  }

  /**
   * Obtiene el nombre legible del motivo a partir de su valor.
   * @param valorMotivo El valor ('general', 'cotizacion', 'soporte')
   * @returns El nombre legible ('Consulta General', 'Cotización', etc.)
   */
  obtenerNombreMotivo(valorMotivo: string | undefined): string {
    if (!valorMotivo) {
        return 'N/A';
    }
    const motivoEncontrado = this.motivos.find(m => m.valor === valorMotivo);
    return motivoEncontrado ? motivoEncontrado.nombre : 'Motivo Desconocido';
  }
}