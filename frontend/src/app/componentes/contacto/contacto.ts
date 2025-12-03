
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { AutenticacionService } from '../../servicios/autenticacion'; 
import { ContactoService } from '../../servicios/contacto';

@Component({
  selector: 'app-contacto',
  standalone: true, 
  imports: [
    CommonModule,
    ReactiveFormsModule 
  ],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css'
})
export class Contacto implements OnInit {

  contactoForm: FormGroup;
  estaLogueado = false;
  mensajeEnviado = false;

  // Inyecta los servicios
  private fb = inject(FormBuilder);
  private authService = inject(AutenticacionService);
  private contactoService = inject(ContactoService);

  constructor() {
    // Inicializa el formulario
    this.contactoForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      mensaje: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.estaLogueado = this.authService.estaLogueado();

    if (this.estaLogueado) {
      const usuario = this.authService.obtenerUsuarioActual();
      // Si está logueado, rellena el formulario y deshabilita los campos
      this.contactoForm.patchValue({
        nombre: usuario.nombre,
        email: usuario.email
      });
      this.contactoForm.get('nombre')?.disable();
      this.contactoForm.get('email')?.disable();
    }
  }

  enviarMensaje(): void {
    if (this.contactoForm.invalid) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    // Obtiene los valores (incluyendo los deshabilitados)
    const datosFormulario = this.contactoForm.getRawValue();

    this.contactoService.enviarMensaje(datosFormulario).subscribe({
      next: (respuesta) => {
        this.mensajeEnviado = true;
        this.contactoForm.reset();
        // Si estaba logueado, vuelve a poner sus datos
        if (this.estaLogueado) {
          this.ngOnInit(); // Recarga los datos del usuario en el form
        }
      },
      error: (err) => {
        console.error('Error al enviar consulta:', err);
        alert('Hubo un error al enviar tu mensaje. Intenta más tarde.');
      }
    });
  }
}