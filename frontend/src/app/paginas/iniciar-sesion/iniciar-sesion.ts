import { Component, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario';
import { AutenticacionService } from '../../servicios/autenticacion';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-iniciar-sesion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './iniciar-sesion.html',
  styleUrl: './iniciar-sesion.css'
})
export class IniciarSesion implements OnInit {
  loginForm: FormGroup;
  defaultClientUrl: string = '/cliente/bienvenida';
  returnUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private authService: AutenticacionService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
      }
    });
  }

  mostrarMensaje(mensaje: string): void {
    console.log(`Mensaje al usuario: ${mensaje}`);
    const messageContainer = this.document.getElementById('login-message');
    if (messageContainer) {
      messageContainer.textContent = mensaje;
      messageContainer.style.display = 'block';
      setTimeout(() => messageContainer.style.display = 'none', 5000);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.usuarioService.login(this.loginForm.value).subscribe({
        next: (respuesta: any) => {
          this.authService.guardarSesion(respuesta.token);

          this.usuarioService.obtenerMiPerfil().subscribe({
            next: (usuarioCompleto: any) => {
              this.authService.guardarUsuarioCompleto(usuarioCompleto);
              this.mostrarMensaje(`¡Bienvenido de vuelta, ${usuarioCompleto.nombre}!`);

              // === CORRECCIÓN APLICADA: Buscar 'ROLE_Administrador' en la propiedad 'nombre' ===
              // esAdmin será true si al menos un rol del usuario tiene el nombre 'ROLE_Administrador'
              const esAdmin = usuarioCompleto.roles?.some((rol: any) => rol.nombre === 'ROLE_Administrador');
              let rutaDestino: string;

              if (esAdmin) {
                rutaDestino = '/admin/dashboard';
              } else {
                rutaDestino = this.returnUrl || this.defaultClientUrl;
              }

              this.router.navigate([rutaDestino]);
            },
            error: () => {
              this.mostrarMensaje('Error al cargar tu perfil. Intenta cerrar y volver a entrar.');
            }
          });
        },
        error: (err) => {
          const mensajeError = err.error?.message || 'Credenciales inválidas.';
          this.mostrarMensaje(mensajeError);
        }
      });
    }
  }
}