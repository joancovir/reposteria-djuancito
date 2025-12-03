
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario';
import { RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // --- CAMPOS NUEVOS AÑADIDOS ---
      telefono: [''], // No son requeridos, así que no necesitan Validators
      direccion: ['']
    });
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      // El this.registroForm.value ahora incluye el teléfono y la dirección
      this.usuarioService.registrar(this.registroForm.value).subscribe({
        next: (response) => {
          alert('¡Usuario registrado con éxito!');
          this.router.navigate(['/iniciar-sesion']); // Redirige al login
        },
        error: (error) => {
          console.error('Error en el registro:', error);
          alert('Error en el registro: ' + error.error);
        }
      });
    }
  }
}