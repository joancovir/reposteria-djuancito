import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario';
import { RouterLink } from '@angular/router'; 
import { AutenticacionService } from '../../servicios/autenticacion'; 

@Component({
  selector: 'app-iniciar-sesion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './iniciar-sesion.html',
  styleUrl: './iniciar-sesion.css'
})
export class IniciarSesion {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private authService: AutenticacionService, 
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
onSubmit(): void {
  if (this.loginForm.valid) {
    this.usuarioService.login(this.loginForm.value).subscribe({
      next: (respuesta) => { // 'respuesta' ahora es un objeto { token: '...' }
        this.authService.guardarSesion(respuesta.token); // <-- Pasamos solo el token
        alert('¡Bienvenido de vuelta!');

        // Lógica de redirección por rol
        const datosUsuario = this.authService.obtenerUsuarioActual();
        const esAdmin = datosUsuario?.roles?.some((rol: any) => rol.authority === 'ROLE_ADMINISTRADOR');

        if (esAdmin) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/cliente']);
        }
      },
      error: (err) => {
        console.error('Error en el login:', err);
        const mensajeError = err.error?.message || 'Credenciales inválidas.';
        alert(mensajeError);
      }
    });
  }
}
}