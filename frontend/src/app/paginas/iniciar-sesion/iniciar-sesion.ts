import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario';
import { AutenticacionService } from '../../servicios/autenticacion';

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

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private authService: AutenticacionService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.usuarioService.login(this.loginForm.value).subscribe({
        next: (respuesta: any) => {
          this.authService.guardarSesion(respuesta.token);

          this.usuarioService.obtenerMiPerfil().subscribe({
            next: (usuarioCompleto: any) => {
              this.authService.guardarUsuarioCompleto(usuarioCompleto);

              // MOSTRAR MODAL DE ÉXITO
              const nombreEl = this.document.getElementById('nombreUsuarioExito');
              if (nombreEl) nombreEl.textContent = `${usuarioCompleto.nombre} `;

              const modalExito = new (window as any).bootstrap.Modal(
                this.document.getElementById('modalExito')
              );
              modalExito.show();

              // REDIRECCIÓN CUANDO CIERRE EL MODAL
              const modalElement = this.document.getElementById('modalExito');
              modalElement?.addEventListener('hidden.bs.modal', () => {
                const esAdmin = usuarioCompleto.roles?.some((rol: any) => rol.nombre === 'ROLE_Administrador');
                let ruta: string;

                if (esAdmin) {
                  ruta = '/admin/dashboard';
                } else {
                  const redirect = localStorage.getItem('redirect_after_login');
                  ruta = redirect === '/cliente/mi-pedido' ? '/cliente/mi-pedido' : this.defaultClientUrl;
                  localStorage.removeItem('redirect_after_login');
                }

                this.router.navigate([ruta]);
              }, { once: true });
            },
            error: () => {
              this.mostrarModalError('Error al cargar tu perfil. Intenta más tarde.');
            }
          });
        },
        error: (err) => {
          const msg = err.error?.message || 'Credenciales inválidas. Verifica tu correo y contraseña.';
          this.mostrarModalError(msg);
        }
      });
    }
  }

  private mostrarModalError(mensaje: string): void {
    const msgEl = this.document.getElementById('mensajeErrorModal');
    if (msgEl) msgEl.textContent = mensaje;

    const modalError = new (window as any).bootstrap.Modal(
      this.document.getElementById('modalError')
    );
    modalError.show();
  }
}