import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // <-- Imports para formularios
import { Router } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario'; // Importa tu servicio
import { RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink], // <-- Añade ReactiveFormsModule
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
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
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